// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "./interfaces/IERC20.sol";

contract GasTank {
    IERC20 public token;
    address public Admin;
    address public Relayer;
    address public GasTankFactory;
    address public CTSIToken;
    address public dApp_Address;
    uint256[] public transactionIDs;
    mapping (uint256 => newTransaction) transactionRecord;

    struct newTransaction {
        uint256 transactionId;
        uint256 transactionTime;
        uint256 amountCharged;
        address txCallerAddress;
    }

    event gasTankFunded(address funder, uint256 amount);
    event withdrawalFromGasTank(address caller, uint256 amount);
    event txChargeFromGasTank(address caller, uint256 tx_id, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == Admin, "Unauthorized caller");
        _;
    }

    constructor (address admin, address relayer, address gasTankFactory, address _CTSIToken, address dappAddress) {
        Admin = admin;
        Relayer = relayer;
        GasTankFactory = gasTankFactory;
        CTSIToken = _CTSIToken;
        token = IERC20(_CTSIToken);
        dApp_Address = dappAddress;
    }

    function fundGasTank(uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
        emit gasTankFunded(msg.sender, amount);
    } 


    function withdrawGas(uint256 amount) onlyAdmin() external {
        require(gasTankBalance() >= amount, "INSUFFICINET BALLANCE");
        token.transfer(Admin, amount);
        emit withdrawalFromGasTank(msg.sender, amount);
    }

    function gasTankBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function chargeGasFees(uint256 amount, uint256 transactionID, address txCaller) external {
        require(gasTankBalance() >= amount, "INSUFFICINET BALLANCE TO COVER TX FEES");

        newTransaction memory newTx;
        newTx.amountCharged = amount;
        newTx.transactionId = transactionID;
        newTx.transactionTime = block.timestamp;
        newTx.txCallerAddress = txCaller;

        transactionIDs.push(transactionID);
        transactionRecord[transactionID] = newTx;

        token.transfer(Relayer, amount);
        emit txChargeFromGasTank(msg.sender, transactionID, amount);
    }

}
