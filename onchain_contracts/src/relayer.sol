// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "./interfaces/IINPUTBOX.sol";
import "./interfaces/IGASFACTORY.sol";
import "./interfaces/IGASTANK.sol";
import "./interfaces/IERC20.sol";

contract Relayer {
    IInputBox public InputBox;
    IGasTankFactory public gasFactory;
    uint256 public totalTx;
    uint256 public percentageCharge;
    address public admin;
    address public CTSIToken;
    bool public isInitialized;
    mapping(address => bool) public isMessenger;
    mapping(address => uint256) public targetTxCounter;
    mapping(address => mapping(uint256 => txDetails)) public txStructData;

    struct txDetails {
        uint256 mainTxId;
        uint256 feeCharged;
        address caller;
        address messanger;
    }


    modifier onlyAdmin() {
        require(msg.sender == admin, "UNAUTHORIZED CALLER");
        _;
    }

    modifier validMessanger() {
        require(isMessenger[msg.sender] == true, "UNAUTHORIZED MESSANGER");
        _;
    }

    constructor (address InputBoxAddr, address _CTSI_token) {
        InputBox = IInputBox(InputBoxAddr);
        CTSIToken = _CTSI_token;
    }

    function initializeContract(address _gasFactory) external onlyAdmin() {
        require(isInitialized == false, "ALREADY INITIALIZED");
        gasFactory = IGasTankFactory(_gasFactory);
        isInitialized = true;
    }

    function registerMessengerAddress(address messenger) onlyAdmin() external {
        require(messenger != address(0), "address zero is not allowed");
        isMessenger[messenger] = true;
    }

    function delistMessengerAddress(address messenger) onlyAdmin() external {
        require(messenger != address(0), "address zero is not allowed");
        isMessenger[messenger] = false;
    }

    function setPercentageChargeFee(uint256 amount) onlyAdmin() external {
        require(amount != 0, "fee cannot be zero");
        percentageCharge = amount;
    }

    function relayInput(address target, uint256 fee, address caller, bytes memory payload) validMessanger() external returns(bool) {
        address gasTank = gasFactory.getGatTankAddress(target);
        require(gasTank != address(0), "Target has no gas tank yet!!");

        targetTxCounter[target]++;
        totalTx++;
        uint256 txId = targetTxCounter[target];

        IGasTank(gasTank).chargeGasFees(fee, txId, caller);
        InputBox.addInput(target, payload);

        bool status = recordTx(target, caller, fee, txId, totalTx, msg.sender);

        require(status == true, "TRANSACTION EXECUTION FAILED");
        return true;
    }


    function recordTx(address target, address caller, uint256 amount, uint256 txId, uint256 mainTxId, address messanger) internal returns(bool) {
        txDetails memory newTx;
        newTx.caller = caller;
        newTx.mainTxId = mainTxId;
        newTx.feeCharged = amount;
        newTx.messanger = messanger;

        txStructData[target][txId] = newTx;

        uint256 fee = (amount * percentageCharge) / 100;
        return IERC20(CTSIToken).transfer(messanger, amount - fee);
    }

    function withdrawBalance(uint256 amount) onlyAdmin() external { 
        uint256 balance = IERC20(CTSIToken).balanceOf(address(this));
        require(balance >= amount, "INSUFFICIENT BALANCE");

        IERC20(CTSIToken).transfer(admin, amount);
    }

    function relayerBalance() public view returns (uint256) {
        return IERC20(CTSIToken).balanceOf(address(this));
    }

}
