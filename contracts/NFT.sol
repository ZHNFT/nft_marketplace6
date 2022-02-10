//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    uint count;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Nft", "NFT") {

        contractAddress = marketplaceAddress;

    }


    function mint(string memory _uri) public {

        uint totalSupply = count;
        _mint(msg.sender, totalSupply);
        _setTokenURI(totalSupply, _uri);

        setApprovalForAll(contractAddress, true);

        count += 1;

    }

}