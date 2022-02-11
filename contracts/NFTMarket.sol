//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarket is ReentrancyGuard, Ownable {

    uint private itemIds;
    uint private itemsSold;

    uint listingPrice = 0.25 ether;

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;

    }

    mapping(uint => MarketItem) private idMarketItem;

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        address owner,
        uint price
    );

    event itemSold(MarketItem item);

    constructor() {

    }

    /// @notice function to get listing price
    function getListingPrice() public view returns(uint) {
        return listingPrice;
    }

    /// @notice function to set the listing price, can only be set by the owner of the contract
    function setListingPrice(uint _price) external onlyOwner {
        listingPrice = _price;
    }

    /// @notice function to create a market item
    function createMarketItem(address nftContract, uint tokenId, uint price) public payable nonReentrant {

        require(price > 0, "Price cannot be zero");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        uint itemId = itemIds;

        idMarketItem[itemId] = MarketItem(itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price, false);

        //TODO: probably dont want to do it this way
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price);

        itemIds += 1;

    }

    /// @notice function to create a sale
    function createMarketSale(uint itemId) public payable nonReentrant {

        MarketItem memory item = idMarketItem[itemId];

        require(msg.value == item.price, "Value must equal asking price");

        IERC721(item.nftContract).transferFrom(address(this), msg.sender, item.tokenId);

        idMarketItem[itemId].owner = payable(msg.sender);
        idMarketItem[itemId].sold = true;

        itemsSold += 1;

        item.seller.transfer(msg.value);

        payable(owner()).transfer(listingPrice);

    }


    /// @notice total number of items on our platform
    function fetchMarketItems() public view returns(MarketItem[] memory) {

        uint itemCount = itemIds;

        uint unsoldItemCount = itemCount - itemsSold;

        MarketItem[] memory marketItems = new MarketItem[](unsoldItemCount);

        uint count;

        for(uint i = 0; i < itemCount; i++) {

            //check if the item has not been sold
            if(!idMarketItem[i].sold) {
                marketItems[count] = idMarketItem[i];
                count++;
            }

        }

        return marketItems;

    }

    /// @notice fetch list of nfts bought by user
    function fetchMyNFTS() public view returns(MarketItem[] memory) {

        uint totalCount = itemIds;

        uint count;

        MarketItem[] memory tempArray = new MarketItem[](totalCount);

        for(uint i = 0; i < totalCount; i++) {

            if(idMarketItem[i].owner == msg.sender) {

                tempArray[count] = idMarketItem[i];
                count++;
            }
        }

        MarketItem[] memory finalArray = new MarketItem[](count);

        for(uint i = 0; i < count; i++) {

            finalArray[i] = tempArray[i]; 

        }

        return finalArray;


    }

    /// @notice fetch list of nft created by user
    function fetchItemsCreated() public view returns(MarketItem[] memory) {

        uint totalCount = itemIds;

        uint count;

        MarketItem[] memory tempArray = new MarketItem[](totalCount);

        for(uint i = 0; i < totalCount; i++) {

            if(idMarketItem[i].seller == msg.sender) {

                tempArray[count] = idMarketItem[i];
                count++;
            }
        }

        MarketItem[] memory finalArray = new MarketItem[](count);

        for(uint i = 0; i < count; i++) {

            finalArray[i] = tempArray[i]; 

        }

        return finalArray;


    }



}