//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IHiveNFT is IERC721 {

    function mintAuction() external returns (uint256);

    function setTokenGenerationRate(uint _tokenId, uint _rate) external;

}