// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// "SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.8.0;

contract Impersonate {

    event Impersonation(address indexed player, address indexed impersonator);
    event ImpersonationRemoval(address indexed player, address indexed impersonator);

    mapping(address => address) impersonations;

    // lookup for who is impersonating msg.sender
    function impersonator() public view returns (address) {
      // will be msg.sender if no one is impersonating msg.sender
      return impersonations[msg.sender] != address(0) ? impersonations[msg.sender] : msg.sender;
    }
    
    // msg.sender is allowing _newImpersonator to play for them
    function impersonateMe(address _newImpersonator) public {
      require(_newImpersonator != msg.sender, 'cannot impersonate self');

      impersonations[_newImpersonator] = msg.sender;

      // _newImpersonator is impersonating msg.sender
      emit Impersonation(msg.sender, _newImpersonator);
    }

    function removeImpersonator(address _newImpersonator) public {
      require(impersonations[_newImpersonator] == msg.sender, 'only current impersonator can remove themselves');

      impersonations[_newImpersonator] = address(0);

      // _newImpersonator is no longer impersonating msg.sender
      emit ImpersonationRemoval(msg.sender, _newImpersonator);
    }

    // general lookup for who can impersonating who. 
    // If return == address(0), account isn't impersonate anyone.
    function isImpersonating(address _account) public view returns (address) {
      return impersonations[_account];
    }
}
