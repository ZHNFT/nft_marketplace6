const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const MarketContract = await ethers.getContractFactory("NFTMarket");
    const market = await MarketContract.deploy();
    await market.deployed();

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(market.address);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.mint("https://butt69.eth");
    await nft.mint("https://butt70.eth");
    await nft.mint("https://butt71.eth");
    await nft.mint("https://butt72.eth");
    await nft.mint("https://butt73.eth");
    

    await market.createMarketItem(nftContractAddress, 0, auctionPrice, {value : listingPrice});

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value : listingPrice});

    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value : listingPrice});

    await market.createMarketItem(nftContractAddress, 3, auctionPrice, {value : listingPrice});

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(1, {value : auctionPrice});

    let items = await market.fetchMarketItems();

    items = await Promise.all(items.map(async i => {

      console.log(i);

      const tokenURI = await nft.tokenURI(i.tokenId);
      let item = {
        price : i.price.toString(),
        tokenId : i.tokenId.toString(),
        seller : i.seller,
        owner : i.owner,
        tokenURI
      }

      return item;

    }))

    console.log(items);

   
  });
});
