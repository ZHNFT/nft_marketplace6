//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestERC1155 is ERC1155 {

    constructor() ERC1155("TestERC1155") {

    }

   
    function mint(uint _amount, uint _tokenId) public {

      
        _mint(msg.sender, _tokenId, _amount, bytes(""));
 

    }

    

    

}