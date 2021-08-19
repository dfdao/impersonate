// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.7.0;

// This is the main building block for smart contracts.
contract Impersonate {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    string public name = "Impersonate Contract";

    address public DAO_ADDRESS = 0x954BE89FA4DC29d982E54586fEBBbFEbC894E9c1;

    mapping(address => address) impersonations;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    /* constructor() {
      impersonations[msg.sender] = DAO_ADDRESS; // sender impersonates the dao
    } */

    function impersonateMe(address impersonator) public returns (bool) {
      // msg.sender allows impersonator to impersonate them
      impersonations[msg.sender] = impersonator;

      // NOTE: currently only allows 1 person to impersonate at a time.
    }

    // general lookup for who is impersonating who
    function isImpersonating(address impersonator) public view returns (address) {
      return impersonations[impersonator];
    }

    function _getImpersonator() public view returns (address) {
      // will be msg.sender if no one is impersonating msg.sender
      return impersonations[msg.sender] != address(0) ? impersonations[msg.sender] : msg.sender;
    }

    function impersonateTest(uint256 a, uint256 b) public pure returns (uint256) {
      return a + b;
    }
}
