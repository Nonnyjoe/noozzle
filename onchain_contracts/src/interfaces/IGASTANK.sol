// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IGasTank {
    struct newTransaction {
        uint256 transactionId;
        uint256 transactionTime;
        uint256 amountCharged;
        address txCallerAddress;
    }

    event gasTankFunded(address funder, uint256 amount);
    event withdrawalFromGasTank(address caller, uint256 amount);
    event txChargeFromGasTank(address caller, uint256 tx_id, uint256 amount);

    function token() external view returns (address);
    function Admin() external view returns (address);
    function Relayer() external view returns (address);
    function GasTankFactory() external view returns (address);
    function CTSIToken() external view returns (address);
    function dApp_Address() external view returns (address);
    function transactionIDs(uint256 index) external view returns (uint256);
    function transactionRecord(uint256 transactionId) external view returns (uint256, uint256, uint256, address);

    function fundGasTank(uint256 amount) external;
    function withdrawGas(uint256 amount) external;
    function gasTankBalance() external view returns (uint256);
    function chargeGasFees(uint256 amount, uint256 transactionID, address txCaller) external;
}
