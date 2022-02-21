const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Test", function () {

  it("Should recieve a gas estimation to mint 5 nfts", async function () {

    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const MARKET = await ethers.getContractFactory("HiveMarketplaceV2");
    const market = await MARKET.deploy();

    await market.deployed();

    const address = market.address;

    const domain = {

        name : "HIVENFTMarketplace",
        version : "1",
        chainId : 13881,
        verifyingContract : address
    
    }

    //Set timestamp to be twice current time for expiry
    const timestamp = (Date.now() * 2);

    console.log(timestamp);

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

    let tokenId = 5;
    
    let nonce = 0;

    let ownerAddress = owner.address;

    let pricePerItem = 1000;

    let quantity = 1;

    let expiry = timestamp;

    // The data to sign
    const value = {
        nftContractAddress: address,
        tokenId : tokenId,
        owner : ownerAddress,
        pricePerItem : pricePerItem,
        quantity : quantity,
        expiry : expiry,
        nonce : nonce
    };

    let signature = await owner._signTypedData(domain, types, value);

    const verifiedAddress = ethers.utils.verifyTypedData(
        domain,
        types,
        value,
        signature
    );

    console.log(ownerAddress);
    console.log(verifiedAddress);

    console.log(verifiedAddress == ownerAddress);

    let splitSignature = ethers.utils.splitSignature(signature);

    console.log(splitSignature);

  });


});


