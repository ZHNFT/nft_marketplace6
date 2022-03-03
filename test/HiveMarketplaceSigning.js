const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hive Marketplace Test", function () {

    let HONEY;
    let honey;
    let NFT;
    let nft;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addrs;
    let MARKET; 
    let market;
    let domain; 

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {

        HONEY = await ethers.getContractFactory("HoneyTestToken");
        honey = await HONEY.deploy();

        NFT = await ethers.getContractFactory("TestCollection");
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();

        MARKET = await ethers.getContractFactory("HiveMarketplaceV2");

        //deploy the market with a fee of 7.5%, fee reciepient of addr3, and the honey token address
        market = await MARKET.deploy(750, addr3.address, honey.address);

        await market.deployed();

        nft = await NFT.deploy();

        let chainId = await market.getChainId();

        //TODO: change the chain id, currently this is the development chainId
        domain = {

            name : "HIVENFTMarketplace",
            version : "1",
            chainId : chainId,
            verifyingContract : market.address
        
        }

        await honey.deployed();

        await honey.createTokens(1000000);

        await honey.connect(addr1).createTokens(100000);

        await nft.mint(10);

        await nft.connect(addr1).mint(10);

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

        await market.addToWhitelist(nft.address, addr4.address, 100);
           
        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');


    })

    it("fails to accept a listing if nft approval hasnt been set", async function () {

        let listing = getDefaultListing();

        await market.addToWhitelist(nft.address, addr4.address, 100);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await expect(market.connect(addr1).AcceptListing(listing)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');


    })

    it("Successfully transfers an nft if the signature, listing parameters, and approvals are all set", async function () {

        await nft.setApprovalForAll(market.address, true);

        expect(await nft.isApprovedForAll(owner.address, market.address)).to.equal(true);

        let listing = getDefaultListing();

        await market.addToWhitelist(nft.address, addr4.address, 100);

        //approve the market contract to use honey tokens
        await honey.connect(addr1).approve(market.address, 1000)
           
        listing = await getSignatureListing(listing, domain, owner);

        await market.connect(addr1).AcceptListing(listing)

        expect(await nft.ownerOf(1)).to.equal(addr1.address);

    })




});

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

    const verifiedAddress = ethers.utils.verifyTypedData(
        domain,
        types,
        value,
        signature
    );

    let splitSignature = ethers.utils.splitSignature(signature);

    listing.v = splitSignature.v;
    listing.s = splitSignature.s;
    listing.r = splitSignature.r;

    return listing;

}


