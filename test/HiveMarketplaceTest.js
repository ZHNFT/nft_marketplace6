const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hexagon Marketplace Test", function () {

    let HONEY;
    let honey;

    let WETH;
    let wETH;

    let WMATIC;
    let wMatic;


    let NFT;

    let ERC1155;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addrs;
    let MARKET; 
    let market;
    let domain;
    let nft;
    
    let erc1155;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {

        [owner, addr1, addr2, addr3, addr4, addr5, ...addrs] = await ethers.getSigners();

        HONEY = await ethers.getContractFactory("TestERC20");
        honey = await HONEY.deploy();

        WMATIC = await ethers.getContractFactory("TestERC20");
        wMatic = await WMATIC.deploy();

        WETH = await ethers.getContractFactory("TestERC20");;
        wETH = await WETH.deploy();

        NFT = await ethers.getContractFactory("TestCollection");
       
        MARKET = await ethers.getContractFactory("HexagonMarketplace");

        feeAllocations = [{wallet : addr3.address, percent : 4000}, {wallet : addr4.address, percent : 5000}, {wallet : addr5.address, percent : 1000}];

        //deploy the market with a fee of 7.5%, fee reciepient of addr3, and the honey token address
        market = await MARKET.deploy(feeAllocations);

        await market.deployed();

        nft = await NFT.deploy();

        await nft.deployed();

        let chainId = await market.getChainId();

        //TODO: change the chain id, currently this is the development chainId
        domain = {

            name : "HEXAGONMarketplace",
            version : "1",
            chainId : chainId,
            verifyingContract : market.address
        
        }

        //Mint some tokens used for testing
        await honey.deployed();

        await honey.mintTokens(1000000);

        await honey.connect(addr1).mintTokens(100000);

        await wETH.deployed();

        await wETH.mintTokens(1000000);

        await wETH.connect(addr1).mintTokens(100000);

        await wETH.deployed();

        await wETH.mintTokens(1000000);

        await wETH.connect(addr1).mintTokens(100000);

        await wMatic.deployed();

        await wMatic.mintTokens(1000000);

        await wMatic.connect(addr1).mintTokens(100000);

        //Add tokens as payment tokens

        //honey will have zero fees
        await market.setPaymentToken(honey.address, 0, 0);

        //wETH will have 3% fees
        await market.setPaymentToken(wETH.address, 300, 1);

        //wMatic will have 3% fees
        await market.setPaymentToken(wMatic.address, 300, 2);


        await nft.mint(10);

        await nft.connect(addr1).mint(10);

        ERC1155 = await ethers.getContractFactory("TestERC1155");

        erc1155 = await ERC1155.deploy();

        await erc1155.deployed();

        erc1155.mint(10, 0);

        erc1155.connect(addr1).mint(10, 1);



    });

    it("Wallets have correct balances", async function () {
        
        expect(await nft.balanceOf(owner.address)).to.equal(10);

        expect(await nft.balanceOf(addr1.address)).to.equal(10);
    

    });

    it("Can give permissions to contract", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);


    })

    it("can generate a valid listing signature", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        listing = await getSignatureListing(listing, domain, owner);

        expect(await market.ValidListing(listing)).to.equal(true);

    })

    it("generates a invalid listing signature if nft not owned", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();
        //Token id is not owned by owner
        listing.tokenId = 11;
        
        listing = await getSignatureListing(listing, domain, owner);

        expect(await market.ValidListing(listing)).to.equal(false);

    })

    it("generates a invalid listing signature if expired", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();
        listing.expiry = Math.floor((Date.now() / 1000)) - 1000;

        listing = await getSignatureListing(listing, domain, owner);

        expect(await market.ValidListing(listing)).to.equal(false);

    })

    it("fails to accept a listing unless the contract is whitelisted", async function () {

        let listing = getDefaultListing();

        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith('nft not whitelisted');


    })

    it("fails to accept a listing unless payment tokens have been approved", async function () {

        let listing = getDefaultListing();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);
           
        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');


    })

    it("fails to accept a listing if nft approval hasnt been set", async function () {

        let listing = getDefaultListing();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');


    })

    it("Successfully transfers an nft if the signature, listing parameters, and approvals are all set", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        let balanceBefore = await honey.balanceOf(addr1.address);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await market.connect(addr1).AcceptListing(listing)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(await nft.ownerOf(1)).to.equal(addr1.address);

        expect(balanceBefore.gt(balanceAfter)).equal(true);

    })

    it("Successfully transfers an nft using a different payment token", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        await market.addToWhitelist(nft.address, addr4.address, 100, 1);

        let balanceBefore = await wETH.balanceOf(addr1.address);

        //approve the market contract to use honey tokens
        await wETH.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await market.connect(addr1).AcceptListing(listing)

        let balanceafter = await wETH.balanceOf(addr1.address);

        expect(await nft.ownerOf(1)).to.equal(addr1.address);

        expect(balanceBefore.gt(balanceafter)).equal(true);

    })

    it("Successfully transfers an erc1155 if the signature, listing parameters, and approvals are all set", async function () {

        await erc1155.setApprovalForAll(market.address, true);

        expect(await erc1155.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        listing.nftContractAddress = erc1155.address;

        listing.tokenId = 0;

        await market.addToWhitelist(erc1155.address, addr4.address, 100, 0);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await market.connect(addr1).AcceptListing(listing)

        expect(await erc1155.balanceOf(addr1.address, 0)).to.equal(1);

    })

    it("Successfully transfers multiple erc1155 if the signature, listing parameters, and approvals are all set", async function () {

        await erc1155.setApprovalForAll(market.address, true);

        expect(await erc1155.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        listing.nftContractAddress = erc1155.address;

        listing.quantity = 2;

        listing.pricePerItem = 500;

        listing.tokenId = 0;

        await market.addToWhitelist(erc1155.address, addr4.address, 100, 0);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await market.connect(addr1).AcceptListing(listing)

        expect(await erc1155.balanceOf(addr1.address, 0)).to.equal(2);

    })

    it("Fails to transfer of erc1155 tokens if users doesnt have balance", async function () {

        await erc1155.setApprovalForAll(market.address, true);

        expect(await erc1155.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        listing.nftContractAddress = erc1155.address;

        listing.quantity = 2;

        listing.pricePerItem = 500;

        listing.tokenId = 1;

        await market.addToWhitelist(erc1155.address, addr4.address, 100, 0);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith('ERC1155: insufficient balance for transfer')

    })

    it("Fails to transfer of erc1155 tokens if users doesnt have enough funds approved to pay pericePerItem * quantity", async function () {

        await erc1155.setApprovalForAll(market.address, true);

        expect(await erc1155.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        listing.nftContractAddress = erc1155.address;

        listing.quantity = 2;

        listing.pricePerItem = 500;

        listing.tokenId = 0;

        await market.addToWhitelist(erc1155.address, addr4.address, 100, 0);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 900)
           
        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith("ERC20: insufficient allowance")


    })

    it("can generate a valid offer signature", async function () {

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)

        let offer = getDefaultOffer();

        offer = await getSignatureOffer(offer, domain, owner);

        expect(await market.ValidBid(offer)).to.equal(true);

    })

    it("generates a invalid offer signature user doesn't have the balance", async function () {

        let offer = getDefaultOffer();
       
        //send tokens away so owner doesnt have enough tokens
        await honey.transfer(addr1.address, 1000000);
        
        offer = await getSignatureOffer(offer, domain, owner);

        expect(await market.ValidBid(offer)).to.equal(false);

    })

    it("generates a invalid offer signature if expired", async function () {

        let offer = getDefaultOffer();

        offer.expiry = Math.floor((Date.now() / 1000)) - 1000;
       
        offer = await getSignatureOffer(offer, domain, owner);

        expect(await market.ValidBid(offer)).to.equal(false);


    })

    it("fails to accept a offer unless the contract is whitelisted", async function () {

        let offer = getDefaultOffer();
       
        offer = await getSignatureOffer(offer, domain, owner);

        await expect(market.AcceptBid(offer)).to.be.revertedWith('nft not whitelisted');

    })

    it("fails to accept a offer if nft approval hasnt been set", async function () {

        let offer = getDefaultOffer();

        offer.tokenId = 11
       
        offer = await getSignatureOffer(offer, domain, owner);

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);
           
        await expect(market.connect(addr1).AcceptBid(offer)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');


    })

    it("fails to accept a offer unless payment tokens have been approved", async function () {

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.connect(addr1).setApprovalForAll(market.address, true);

        let offer = getDefaultOffer();

        offer.tokenId = 11
       
        offer = await getSignatureOffer(offer, domain, owner);

        await expect(market.connect(addr1).AcceptBid(offer)).to.be.revertedWith("ERC20: insufficient allowance");


    })

    it("Successfully transfers an nft from an offer if the signature, offer parameters, and approvals are all set", async function () {

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.connect(addr1).setApprovalForAll(market.address, true);

        let offer = getDefaultOffer();

        offer.tokenId = 11
       
        offer = await getSignatureOffer(offer, domain, owner);

        await nft.setApprovalForAll(market.address, true);

        let balanceBefore = await honey.balanceOf(owner.address);

        //approve the market contract to use honey tokens
        await honey.approve(market.address, 10000000000)

        await market.connect(addr1).AcceptBid(offer)

        let balanceAfter = await honey.balanceOf(owner.address);

        expect(await nft.ownerOf(11)).to.equal(owner.address);

        expect(balanceBefore.gt(balanceAfter)).equal(true);

    })

    it("Successfully accept offer using a different payment token", async function () {

        await market.addToWhitelist(nft.address, addr4.address, 100, 2);

        await nft.connect(addr1).setApprovalForAll(market.address, true);

        let offer = getDefaultOffer();

        offer.tokenId = 11
       
        offer = await getSignatureOffer(offer, domain, owner);

        await nft.setApprovalForAll(market.address, true);

        let balanceBefore = await wMatic.balanceOf(owner.address);

        //approve the market contract to use honey tokens
        await wMatic.approve(market.address, 10000000000)

        await market.connect(addr1).AcceptBid(offer)

        let balanceAfter = await wMatic.balanceOf(owner.address);

        expect(await nft.ownerOf(11)).to.equal(owner.address);

        expect(balanceBefore.gt(balanceAfter)).equal(true);

    })

    it("fails to accept a offer unless the contract is whitelisted", async function () {

        let offer = getDefaultOffer();
       
        offer = await getSignatureOffer(offer, domain, owner);

        await expect(market.AcceptBid(offer)).to.be.revertedWith('nft not whitelisted');

    })

    it("Cannot create auction unless whitelisted", async function () {

        let auction = getDefaultAuction();
       
        await expect(market.placeAuction(auction)).to.be.revertedWith('nft not whitelisted');

    })

    it("Cannot create auction with invalid expiry date", async function () {

        let auction = getDefaultAuction();

        auction.expiry = Math.floor((Date.now() / 1000)) - 1000;

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);
       

        await expect(market.placeAuction(auction)).to.be.revertedWith("Auction needs to have a duration")


    })

    it("fails to create an auction if percent is under 5", async function () {

        let auction = getDefaultAuction();

        auction.percentIncrement = 40;

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);
       
        await expect(market.placeAuction(auction)).to.be.revertedWith( "need to set a minimum percent of at least 5");


    })

    it("fails to create an auction if no min bid is set", async function () {

        let auction = getDefaultAuction();

        auction.minBid = 0;

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);
       
        await expect(market.placeAuction(auction)).to.be.revertedWith("have to set a minimum bid");


    })

    it("fails to create an auction if nft approval hasnt been set", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);
       
        await expect(market.placeAuction(auction)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');


    })

    it("can successfully create an auction", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);
       
        await market.placeAuction(auction);

        expect(await nft.ownerOf(auction.tokenId)).to.equal(market.address);


    })

    it("fails to create an auction if one already exists for that token", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);
       
        await market.placeAuction(auction);

        expect(await nft.ownerOf(auction.tokenId)).equal(market.address);

        await expect(market.placeAuction(auction)).to.be.revertedWith("Auction already exists");


    })

    it("Cant bid on a auction that doesnt exist", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);
       
        await expect(market.connect(addr1).placeAuctionBid(nft.address, 0, owner.address, etherToWei(11))).to.be.revertedWith("Auction doesn't exist");


    })

    it("Can't bid on your own item", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);
       
        await expect(market.placeAuctionBid(nft.address, 1, owner.address, etherToWei(11))).to.be.revertedWith("Can't bid on your own item")


    })

    it("Can't bid if you dont have allowance set", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);
       
        await expect(market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, etherToWei(11))).to.be.revertedWith("ERC20: insufficient allowance")


    })

    it("bid needs to be above minimum", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await expect(market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 999)).to.be.revertedWith("Amount needs to be more than the min bid")

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore)).equal(false);

    })

    it("Can bid", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore)).equal(true);

    })

    it("Outbid requires it to be above percent increase", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore)).equal(true);

        await honey.connect(addr2).mintTokens(10000)

        let minIncrease = Math.floor((1000 * auction.percentIncrement) / 1000);

        let failedAmount = 1000 + minIncrease - 1;

        //approve the market contract to use honey tokens
        await honey.connect(addr2).approve(market.address, 100000000)

        await expect(market.connect(addr2).placeAuctionBid(nft.address, 1, owner.address, failedAmount)).to.be.revertedWith("Amount needs to be more than last bid, plus increment")



    })

    it("Can outbid", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore)).equal(true);

        await honey.connect(addr2).mintTokens(10000)

        let minIncrease = Math.floor((1000 * auction.percentIncrement) / 1000);

        let Amount = 1000 + minIncrease;

        //approve the market contract to use honey tokens
        await honey.connect(addr2).approve(market.address, 100000000)

        await market.connect(addr2).placeAuctionBid(nft.address, 1, owner.address, Amount)

        let balanceAfterOutbid = await honey.balanceOf(addr1.address);

        expect(balanceAfterOutbid).equal(balanceOfBefore);

    })

    it("Can claim", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        let timestamp = await market.getTimestamp();

        auction.expiry = timestamp + 10;

        console.log(timestamp.toString())

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore)).equal(true);

        await honey.connect(addr2).mintTokens(10000)

        let minIncrease = Math.floor((1000 * auction.percentIncrement) / 1000);

        let Amount = 1000 + minIncrease;

        //approve the market contract to use honey tokens
        await honey.connect(addr2).approve(market.address, 100000000)

        await market.connect(addr2).placeAuctionBid(nft.address, 1, owner.address, Amount)

        let balanceAfterOutbid = await honey.balanceOf(addr1.address);

        expect(balanceAfterOutbid).equal(balanceOfBefore);

        console.log("waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10 * 1000));

        let balanceOwnerBefore = await honey.balanceOf(owner.address);

        await market.concludeAuction(nft.address, auction.tokenId, owner.address);

        let balanceOwnerAfter = await honey.balanceOf(owner.address);

        expect(balanceOwnerAfter.gt(balanceOwnerBefore)).equal(true);

        expect(await nft.ownerOf(auction.tokenId)).equal(addr2.address);


    })

    it("Can claim using another token", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 1);

        await nft.setApprovalForAll(market.address, true);

        let timestamp = await market.getTimestamp();

        auction.expiry = timestamp + 10;

        console.log(timestamp.toString())

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await wETH.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await wETH.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await wETH.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore)).equal(true);

        await wETH.connect(addr2).mintTokens(10000)

        let minIncrease = Math.floor((1000 * auction.percentIncrement) / 1000);

        let Amount = 1000 + minIncrease;

        //approve the market contract to use honey tokens
        await wETH.connect(addr2).approve(market.address, 100000000)

        await market.connect(addr2).placeAuctionBid(nft.address, 1, owner.address, Amount)

        let balanceAfterOutbid = await wETH.balanceOf(addr1.address);

        expect(balanceAfterOutbid).equal(balanceOfBefore);

        console.log("waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10 * 1000));

        let balanceOwnerBefore = await wETH.balanceOf(owner.address);

        await market.concludeAuction(nft.address, auction.tokenId, owner.address);

        let balanceOwnerAfter = await wETH.balanceOf(owner.address);

        expect(balanceOwnerAfter.gt(balanceOwnerBefore)).equal(true);

        expect(await nft.ownerOf(auction.tokenId)).equal(addr2.address);


    })

    it("Can claim, then can pull fees out of marketplace", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        let timestamp = await market.getTimestamp();

        auction.expiry = timestamp + 10;

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore));

        await honey.connect(addr2).mintTokens(10000)

        let minIncrease = Math.floor((1000 * auction.percentIncrement) / 1000);

        let Amount = 1000 + minIncrease;

        //approve the market contract to use honey tokens
        await honey.connect(addr2).approve(market.address, 100000000)

        await market.connect(addr2).placeAuctionBid(nft.address, 1, owner.address, Amount)

        let balanceAfterOutbid = await honey.balanceOf(addr1.address);

        expect(balanceAfterOutbid).equal(balanceOfBefore);

        console.log("waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10 * 1000));

        let balanceOwnerBefore = await honey.balanceOf(owner.address);

        await market.concludeAuction(nft.address, auction.tokenId, owner.address);

        let balanceOwnerAfter = await honey.balanceOf(owner.address);

        expect(balanceOwnerAfter.gt(balanceOwnerBefore));

        expect(await nft.ownerOf(auction.tokenId)).equal(addr2.address);

        await market.claimFees();

        let address3Balance = await honey.balanceOf(addr3.address);

        let address4Balance = await honey.balanceOf(addr4.address);

        let address5Balance = await honey.balanceOf(addr5.address);

        expect(address4Balance.gt(address3Balance));

        expect(address3Balance.gt(address5Balance));

        expect(address5Balance.gt(0));


    }) 

    it("Updates royalties payed to the collection", async function () {

        let auction = getDefaultAuction();

        await market.addToWhitelist(nft.address, addr4.address, 100, 0);

        await nft.setApprovalForAll(market.address, true);

        let timestamp = await market.getTimestamp();

        auction.expiry = timestamp + 10;

        await market.placeAuction(auction);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 10000000000)

        let balanceOfBefore = await honey.balanceOf(addr1.address);
       
        await market.connect(addr1).placeAuctionBid(nft.address, 1, owner.address, 1000)

        let balanceAfter = await honey.balanceOf(addr1.address);

        expect(balanceAfter.lt(balanceOfBefore));

        await honey.connect(addr2).mintTokens(10000)

        let minIncrease = Math.floor((1000 * auction.percentIncrement) / 1000);

        let Amount = 1000 + minIncrease;

        //approve the market contract to use honey tokens
        await honey.connect(addr2).approve(market.address, 100000000)

        await market.connect(addr2).placeAuctionBid(nft.address, 1, owner.address, Amount)

        let balanceAfterOutbid = await honey.balanceOf(addr1.address);

        expect(balanceAfterOutbid).equal(balanceOfBefore);

        console.log("waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10 * 1000));

        let balanceOwnerBefore = await honey.balanceOf(owner.address);

        await market.concludeAuction(nft.address, auction.tokenId, owner.address);

        let balanceOwnerAfter = await honey.balanceOf(owner.address);

        expect(balanceOwnerAfter.gt(balanceOwnerBefore));

        expect(await nft.ownerOf(auction.tokenId)).equal(addr2.address);

        await market.claimFees();

        let address3Balance = await honey.balanceOf(addr3.address);

        let address4Balance = await honey.balanceOf(addr4.address);

        let address5Balance = await honey.balanceOf(addr5.address);

        expect(address4Balance.gt(address3Balance));

        expect(address3Balance.gt(address5Balance));

        expect(address5Balance.gt(0));

        let royaltiesGenerated = await market.getRoyaltiesGenerated(nft.address);

        expect(royaltiesGenerated.gt(0));


    }) 



    function getDefaultListing() {
        let listing = {}
        listing.nftContractAddress = nft.address;
        listing.tokenId = 1;
        listing.owner = owner.address;
        listing.pricePerItem = 1000;
        listing.quantity = 1;
        listing.expiry = Math.floor((Date.now() / 1000)) * 2;
        listing.nonce = 0;
    
        return listing;
    }

    function getDefaultOffer() {
        let offer = {}
        offer.nftContractAddress = nft.address;
        offer.tokenId = 1;
        offer.bidder = owner.address;
        offer.pricePerItem = 1000;
        offer.quantity = 1;
        offer.expiry = Math.floor((Date.now() / 1000)) * 2;
        offer.nonce = 0;
    
        return offer;
    }

    function getDefaultAuction() {
        let auction = {}
        auction.collectionAddress = nft.address;
        auction.tokenId = 1;
        auction.percentIncrement = 50;
        auction.quantity = 1;
        auction.expiry = Math.floor((Date.now() / 1000)) * 2;
        auction.minBid = 1000
        auction.highestBid = 0;
        auction.highestBidder = "0x0000000000000000000000000000000000000000";
    
        return auction;
    }

    async function getSignatureListing(listing, domain, signer) {

        const types = {
    
            "AcceptListing": [{
                "name": "nftContractAddress",
                "type": "address"
                },
                {
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "pricePerItem",
                    "type": "uint256"
                },
                {
                    "name": "quantity",
                    "type": "uint256"
                },
                {
                    "name": "expiry",
                    "type": "uint256"
                },
                {
                    "name": "nonce",
                    "type": "uint256"
                }
            ]
            
        };
    
        // The data to sign
        const value = {
            nftContractAddress: listing.nftContractAddress,
            tokenId : listing.tokenId,
            owner : listing.owner,
            pricePerItem : listing.pricePerItem,
            quantity : listing.quantity,
            expiry : listing.expiry,
            nonce : listing.nonce
        };
    
        let signature = await signer._signTypedData(domain, types, value);
    
        // const verifiedAddress = ethers.utils.verifyTypedData(
        //     domain,
        //     types,
        //     value,
        //     signature
        // );
    
        let splitSignature = ethers.utils.splitSignature(signature);
    
        listing.v = splitSignature.v;
        listing.s = splitSignature.s;
        listing.r = splitSignature.r;
    
        return listing;
    
    }

    async function getSignatureOffer(offer, domain, signer) {

        const types = {
    
            "AcceptBid": [{
                "name": "nftContractAddress",
                "type": "address"
                },
                {
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "name": "bidder",
                    "type": "address"
                },
                {
                    "name": "pricePerItem",
                    "type": "uint256"
                },
                {
                    "name": "quantity",
                    "type": "uint256"
                },
                {
                    "name": "expiry",
                    "type": "uint256"
                },
                {
                    "name": "nonce",
                    "type": "uint256"
                }
            ]
            
        };
    
        // The data to sign
        const value = {
            nftContractAddress: offer.nftContractAddress,
            tokenId : offer.tokenId,
            bidder : offer.bidder,
            pricePerItem : offer.pricePerItem,
            quantity : offer.quantity,
            expiry : offer.expiry,
            nonce : offer.nonce
        };
    
        let signature = await signer._signTypedData(domain, types, value);
    
        // const verifiedAddress = ethers.utils.verifyTypedData(
        //     domain,
        //     types,
        //     value,
        //     signature
        // );
    
        let splitSignature = ethers.utils.splitSignature(signature);
    
        offer.v = splitSignature.v;
        offer.s = splitSignature.s;
        offer.r = splitSignature.r;
    
        return offer;
    
    }




    function etherToWei(amount) {

        return ethers.utils.parseEther(amount.toString());

    }


});






