// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./gasTank.sol";

contract GasTankFactory {
    uint256 public totalGasTanks;
    address public Relayer;
    address public Admin;
    address public CTSIToken;
    address[] public allGasTanks;
    mapping (address => address[]) public userToDappAddress;
    mapping (address => gasTankDetails) public dappAddressToGasTankDetails;


    struct gasTankDetails {
        uint256 id;
        address admin;
        address tankAddress;
        uint256 dateCreated;
    }

    event gasTankCreated(address creator, address tankAddress);

    constructor(address relayer, address ctsi_Token) {
        Relayer = relayer;
        Admin = msg.sender;
        CTSIToken = ctsi_Token;
    }
   

   function createGasTank(address contractAddress) external {
        GasTank newGasTank = new GasTank(msg.sender, Relayer, address(this), CTSIToken, contractAddress);
        gasTankDetails memory newTankDetails;

        totalGasTanks++;
        newTankDetails.id = totalGasTanks;
        newTankDetails.admin = msg.sender;
        newTankDetails.tankAddress = address(newGasTank);
        newTankDetails.dateCreated = block.timestamp;

        dappAddressToGasTankDetails[contractAddress] = newTankDetails;
        userToDappAddress[msg.sender].push(contractAddress);
        allGasTanks.push(address(newGasTank));

        emit gasTankCreated(msg.sender, address(newGasTank));
   }

    function getGatTankAddress(address contractAddress) public view returns(address) {
        return dappAddressToGasTankDetails[contractAddress].tankAddress;
    }

}

