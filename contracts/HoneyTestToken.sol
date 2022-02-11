// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract HoneyTestToken is Ownable, ERC20 {

    constructor() ERC20("Honey", "HNY") {

    }

    function createTokens(uint _amount) public {

        _mint(msg.sender, _amount);

    }


}