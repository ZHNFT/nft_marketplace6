// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
* @dev simple erc20 contract that allows anyone to mint any amount, used for testing
*/
contract TestERC20 is ERC20 {

    constructor() ERC20("Test ERC20", "TEST") {

    }


    function mintTokens(uint _amount) public {

        _mint(msg.sender, _amount);

    }


}