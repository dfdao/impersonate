// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.0;

import "./Impersonate.sol";

contract Game is Impersonate {

    mapping(address => uint256) public score;

    constructor () {}

    function increment() public returns (uint256) {
      address impersonator = impersonator();
      score[impersonator] += 1;
      return score[impersonator];
    }

    function count(address account) public view returns (uint256) {
      return score[account];
    }

    function whoami() public view returns (address) {
      return msg.sender;
    }
}
