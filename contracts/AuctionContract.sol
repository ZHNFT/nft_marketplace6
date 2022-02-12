// SPDX-License-Identifier: GPL-3.0

/// @title The Hive auction house

// LICENSE
// HiveAuctionHouse.sol is a modified version of NounsDAO's NounsAuctionHouse.sol:
// https://github.com/whalezDAO/whalez-monorepo/blob/d571efb730ff51daca648068a26efee4fe9eebab/packages/whalez-contracts/contracts/NounsAuctionHouse.sol
//
// NounsAuctionHouse.sol source code Copyright NounsDAO licensed under the GPL-3.0 license.
// With modifications by Hive Investments.

pragma solidity ^0.8.0;

import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IHiveNFT } from "./interfaces/IHiveNFT.sol";
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import { IAuctionHouse } from './interfaces/IAuctionHouse.sol';

contract HiveAuctionHouse is
    IAuctionHouse,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable
{

    using SafeERC20 for IERC20;

    // The Hive ERC721 token contract
    IHiveNFT public hiveNFTContract;

    // The address of the DAI contract
    address public dai;

    // The minimum price accepted in an auction
    uint256 public reservePrice;

    // The minimum difference between the last bid amount and the current bid
    uint256 public minBidIncrement;

    // The duration of a single auction
    uint256 public duration;

    uint public baseTokenGenerationRate;

    uint public incrementalTokenGenerationRate;

    Auction public auction;

    /**
     * @notice Initialize the auction house and base contracts,
     * populate configuration values, and pause the contract.
     * @dev This function can only be called once.
     */
    function initialize(
        IHiveNFT _hiveAddress,
        address _dai,
        uint _duration,
        uint _reservePrice,
        uint _minBidIncrement,
        uint _baseTokenGenerationRate,
        uint _incrementalTokenGenerationRate
    ) external initializer {
        __Pausable_init();
        __ReentrancyGuard_init();
        __Ownable_init();

        _pause();

        hiveNFTContract = IHiveNFT(_hiveAddress);
        dai = _dai;
        
        reservePrice = _reservePrice;
        minBidIncrement = _minBidIncrement;

        baseTokenGenerationRate = _baseTokenGenerationRate;
        incrementalTokenGenerationRate = _incrementalTokenGenerationRate;

        duration = _duration;
        
    }

    /**
     * @notice Settle the current auction, mint a new Whale, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction() external override nonReentrant whenNotPaused {
        _settleAuction();
        _createAuction();
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external override whenPaused nonReentrant {
        _settleAuction();
    }

    /**
     * @notice Create a bid for a Whale, with a given amount.
     * @dev This contract only accepts payment in DAI.
     */
    function createBid(uint256 _tokenId, uint _bidAmount) external payable override nonReentrant {
        Auction memory _auction = auction;

        require(_auction.tokenId == _tokenId, 'NFT not up for auction');
        require(block.timestamp < _auction.endTime, 'Auction expired');
        require(_bidAmount >= reservePrice, 'Must send at least reservePrice');
        require((_bidAmount - reservePrice) % minBidIncrement == 0, "Must bid must be in proper increment");

        address payable lastBidder = _auction.bidder;

        auction.amount = _bidAmount;
        auction.bidder = payable(msg.sender);

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            IERC20(dai).safeTransferFrom(address(this), lastBidder, _auction.amount);
        }

        IERC20(dai).safeTransferFrom(msg.sender, address(this), _bidAmount);

        emit AuctionBid(_tokenId, msg.sender, _bidAmount);

       
    }

    /**
     * @notice Pause the auction house.
     * @dev This function can only be called by the owner when the
     * contract is unpaused. While no new auctions can be started when paused,
     * anyone can settle an ongoing auction.
     */
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the Whalez auction house.
     * @dev This function can only be called by the owner when the
     * contract is paused. If required, this function will start a new auction.
     */
    function unpause() external override onlyOwner {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    /**
     * @notice Set the auction time buffer.
     * @dev Only callable by the owner.
     */
    function setDuration(uint256 _duration) external override onlyOwner {
        duration = _duration;

        emit AuctionDurationUpdated(_duration);
    }

    /**
     * @notice Set the auction reserve price.
     * @dev Only callable by the owner.
     */
    function setReservePrice(uint256 _reservePrice) external override onlyOwner {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Set the auction minimum bid increment percentage.
     * @dev Only callable by the owner.
     */
    function setMinBidIncrement(uint8 _minBidIncrement) external override onlyOwner {
        minBidIncrement = _minBidIncrement;

        emit AuctionMinBidIncrementUpdated(_minBidIncrement);
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     * If the mint reverts, the minter was updated without pausing this contract first. To remedy this,
     * catch the revert and pause this contract.
     */
    function _createAuction() internal {
        try hiveNFTContract.mintAuction() returns (uint256 tokenId) {
            
            uint256 startTime = block.timestamp;
            uint256 endTime = startTime + duration;

            auction = Auction({
                tokenId: tokenId,
                amount: 0,
                startTime: startTime,
                endTime: endTime,
                bidder: payable(0),
                settled: false
            });

            emit AuctionCreated(tokenId, startTime, endTime);
        } catch Error(string memory) {
            _pause();
        }
    }

    /**
     * @notice Settle an auction, finalizing the bid and paying out to the owner.
     * @dev If there are no bids, the Whale is sent the owner of the contract.
     */
    function _settleAuction() internal {
        Auction memory _auction = auction;

        require(_auction.startTime != 0, "Auction hasn't begun");
        require(!_auction.settled, 'Auction has already been settled');
        require(block.timestamp >= _auction.endTime, "Auction hasn't completed");

        auction.settled = true;

        if (_auction.bidder != address(0)) {
            hiveNFTContract.transferFrom(address(this), _auction.bidder, _auction.tokenId);
        }

        if (_auction.amount > 0) {
            IERC20(dai).safeTransferFrom(address(this), owner(), _auction.amount);
        }

        hiveNFTContract.setTokenGenerationRate(_auction.tokenId, getGenerationRate(_auction.amount));

        address winner = _auction.bidder == address(0) ? owner() : _auction.bidder;
        emit AuctionSettled(_auction.tokenId, winner, _auction.amount);
    }

    function getGenerationRate(uint _bidAmount) internal view returns(uint) {

        uint rate = baseTokenGenerationRate;

        _bidAmount -= reservePrice;

        rate += ((_bidAmount / minBidIncrement) * incrementalTokenGenerationRate);

        return rate;

    }

}