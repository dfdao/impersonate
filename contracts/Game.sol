// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.0;

import "./Impersonate.sol";

contract Game is Impersonate {

    uint256 public count = 0;

    address public impersonator; // Game can only have one impersonator

    constructor () {
      impersonator = _getImpersonator(); // should be deployer msg.sender to start.
    }

    function impersonateMe (address newImpersonator) public {
      require(_getImpersonator() == impersonator, 'only impersonator can update impersonator');
      _impersonateMe(newImpersonator);
      impersonator = _getImpersonator(); // should this be returned from impersonateMe?
    }

    function increment() public returns (uint256) {
      require(_getImpersonator() == impersonator, 'only impersonator can update count');
      count += 1;
      return count;
    }

    function whoami() public view returns (address) {
      return msg.sender;
    }
}
