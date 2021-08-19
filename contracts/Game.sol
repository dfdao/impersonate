// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.0;

import "./Impersonate.sol";

contract Game is Impersonate {

    uint256 public count = 0;

    address public owner;

    constructor () {
      owner = _getImpersonator(); // should be msg.sender to start.
    }

    function setOwner(address _owner) public {
      require(_getImpersonator() == owner, '_getImpersonator is not owner');
      // allows _owner to impersonate msg.sender
      impersonateMe(_owner);
      // sets owner to new impersonator for msg.sender
      owner = _getImpersonator();
    }

    // only owner can update count
    function increment() public returns (uint256) {
      require(_getImpersonator() == owner, '_getImpersonator is not owner');
      count += 1;
      return count;
    }

    function whoami() public view returns (address) {
      return msg.sender;
    }
}
