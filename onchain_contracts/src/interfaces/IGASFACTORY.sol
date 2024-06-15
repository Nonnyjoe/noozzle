// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IGasTankFactory {
    struct gasTankDetails {
        uint256 id;
        address admin;
        address tankAddress;
        uint256 dateCreated;
    }

    event gasTankCreated(address creator, address tankAddress);

    function totalGasTanks() external view returns (uint256);
    function Relayer() external view returns (address);
    function Admin() external view returns (address);
    function CTSIToken() external view returns (address);
    function allGasTanks(uint256 index) external view returns (address);
    function userToDappAddress(address user, uint256 index) external view returns (address);
    function dappAddressToGasTankDetails(address contractAddress) external view returns (uint256, address, address, uint256);
    function hasAGasTank(address userAddress) external view returns(bool);
    function createGasTank(address contractAddress) external;
    function getGatTankAddress(address contractAddress) external view returns (address);
}
