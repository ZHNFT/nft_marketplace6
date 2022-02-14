//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721Enumerable {

    address contractAddress;

    mapping(uint => string) tokenURIS;

    constructor() ERC721("Nft", "NFT") {

        //contractAddress = marketplaceAddress;

    }

    function _setTokenURI(string memory _tokenURI, uint _tokenId) internal {

        tokenURIS[_tokenId] = _tokenURI;

    }

     /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view  override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return tokenURIS[tokenId];
        //return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }


    function mint(string memory _uri) public {

        uint totalSupply = totalSupply();
        _mint(msg.sender, totalSupply);
        _setTokenURI(_uri, totalSupply);

        setApprovalForAll(contractAddress, true);

    }

    

}