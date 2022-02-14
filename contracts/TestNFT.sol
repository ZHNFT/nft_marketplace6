//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TestNFT is ERC721Enumerable {

    uint maxSupply = 5000;

    mapping(uint => string) tokenURIS;

    string public baseURI;

    constructor() ERC721("Nft", "NFT") {

        //contractAddress = marketplaceAddress;

    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    function mint(uint _amount) public {

        uint totalSupply = totalSupply();

        require(_amount < 11, "too much to mint at once");
        require(totalSupply + _amount < maxSupply, "over max supply");

        for(uint i = 0; i < _amount; i++) {

            _mint(msg.sender, totalSupply + i);

        }
        

    }

    function setBaseURI(string memory _uri) public {
        baseURI = _uri;
    }

    

}