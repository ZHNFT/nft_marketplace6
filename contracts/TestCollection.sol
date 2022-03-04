//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TestCollection is ERC721Enumerable {

    using Strings for uint256;

    uint maxSupply = 10000;

    mapping(uint => string) tokenURIS;

    string public BaseURI = "ipfs://QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/";

    constructor() ERC721("TestCollection", "TESTCOLLECTION") {

        //contractAddress = marketplaceAddress;

    }

    function _baseURI() internal view override returns (string memory) {
        return BaseURI;
    }
    
    function mint(uint _amount) public {

        uint totalSupply = totalSupply();

        require(totalSupply + _amount < maxSupply, "over max supply");

        for(uint i = 0; i < _amount; i++) {

            _mint(msg.sender, totalSupply + i);

        }
        

    }

    function tokenURI(uint tokenId) public view override returns(string memory) {

        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();

        tokenId = tokenId % maxSupply;
        
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";

    }

    function setBaseURI(string memory _uri) public {
        BaseURI = _uri;
    }

    function getTotalSupply() public view returns(uint) {
        return totalSupply();
    }

    

}