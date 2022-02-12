// SPDX-License-Identifier: GPL-3.0

/// @title Interface for Whalez Auction Houses

pragma solidity ^0.8.0;

interface IAuctionHouse {
    struct Auction {
        // ID for the NFT (ERC721 token ID)
        uint256 tokenId;
        // The current highest bid amount
        uint256 amount;
        // The time that the auction started
        uint256 startTime;
        // The time that the auction is scheduled to end
        uint256 endTime;
        // The address of the current highest bid
        address payable bidder;
        // Whether or not the auction has been settled
        bool settled;
    }

    event AuctionCreated(uint256 indexed tokenId, uint256 startTime, uint256 endTime);

    event AuctionBid(uint256 indexed tokenId, address sender, uint256 value);

    event AuctionExtended(uint256 indexed tokenId, uint256 endTime);

    event AuctionSettled(uint256 indexed tokenId, address winner, uint256 amount);

    event AuctionDurationUpdated(uint256 duration);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionMinBidIncrementUpdated(uint256 minBidIncrementPercentage);

    function settleAuction() external;

    function settleCurrentAndCreateNewAuction() external;

    function createBid(uint256 tokenId, uint bidAmount) external payable;

    function pause() external;

    function unpause() external;

    function setDuration(uint256 duration) external;

    function setReservePrice(uint256 reservePrice) external;

    function setMinBidIncrement(uint8 minBidIncrementPercentage) external;
}