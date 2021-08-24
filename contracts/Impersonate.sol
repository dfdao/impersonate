// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.0;

contract Impersonate {

    // TODO: understand indexed better
    event ImpersonationOccurred(address indexed player, address indexed impersonator);

    mapping(address => address) impersonations;

    // lookup for who is impersonating msg.sender
    function impersonator() public view returns (address) {
      // will be msg.sender if no one is impersonating msg.sender
      return impersonations[msg.sender] != address(0) ? impersonations[msg.sender] : msg.sender;
    }
    
    // msg.sender allows impersonator to impersonate them
    function _impersonateMe(address _newImpersonator) internal {
      require(msg.sender != _newImpersonator, 'cannot impersonate self');

      impersonations[msg.sender] = _newImpersonator;
      // NOTE: currently only allows player to impersonate 1 address at a time.
      emit ImpersonationOccurred(msg.sender, _newImpersonator);
    }

    // general lookup for who can impersonating who. 
    // If return == address(0), account isn't impersonate anyone.
    function isImpersonating(address _account) public view returns (address) {
      return impersonations[_account];
    }
}
