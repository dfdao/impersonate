// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.0;

// This is the main building block for smart contracts.
contract Impersonate {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    event ImpersonationOccurred(address indexed player, address indexed impersonator);

    mapping(address => address) impersonations;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    /* constructor() {
      impersonations[msg.sender] = DAO_ADDRESS; // sender impersonates the dao
    } */

    function impersonateMe(address impersonator) public {
      // msg.sender allows impersonator to impersonate them
      impersonations[msg.sender] = impersonator;
      // NOTE: currently only allows player to impersonate 1 address at a time.
      emit ImpersonationOccurred(msg.sender, impersonator);
    }

    // general lookup for who can impersonating who. 
    // If return == address(0), player can't impersonate anyone.
    function isImpersonating(address player) public view returns (address) {
      return impersonations[player];
    }

    // lookup for who is impersonating msg.sender
    function _getImpersonator() public view returns (address) {
      // will be msg.sender if no one is impersonating msg.sender
      return impersonations[msg.sender] != address(0) ? impersonations[msg.sender] : msg.sender;
    }
}
