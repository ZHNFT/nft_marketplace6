// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //We get the contract to deploy
  const Market = await hre.ethers.getContractFactory("HiveMarketplaceV2");
  const market = await Market.deploy(750, "0xA01A05665B010b041199030115A502a9a32687a1", "0x5CFB197753a01353c3AA11db332349bebDE649cC");

  await market.deployed();

  console.log("market deployed at address:")
  console.log(market.address);

  // We get the contract to deploy
  // const NFT = await hre.ethers.getContractFactory("TestCollection");
  // const nft = await NFT.deploy();

  // await nft.deployed();



  // console.log("nft deployed at address:")
  // console.log(nft.address);

  // const HiveMarket = await hre.ethers.getContractFactory("HiveMarketplace");
  // const hive = await HiveMarket.deploy();

  // await hive.deployed();

  // console.log("hive deployed at address:")
  // console.log(hive.address);

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
