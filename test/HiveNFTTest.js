const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {

  it("Should recieve a gas estimation to mint 5 nfts", async function () {

    const HONEY = await ethers.getContractFactory("HoneyTestToken");
    const honey = await HONEY.deploy();

    await honey.deployed();
    const NFT = await ethers.getContractFactory("RandomTokenIdContract");
    const nft = await NFT.deploy(honey.address);
    await nft.deployed();

    for(let i = 0; i < 50; i++) {

      let estimation = await nft.estimateGas.mintTest(2, 47382874);

      estimation = estimation.toString();


      console.log(estimation);

    }
   
  });


});
