// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("attempting to deploy the honey token and nft marketplace");

  console.log("the deployer address is:")
  console.log(deployer.address);
  
  const Honey = await hre.ethers.getContractFactory("HoneyTestToken");
  const honey = await Honey.deploy();

  await honey.deployed();

  console.log("honey deployed at address:")
  console.log(honey.address);

  const basisPoints = 10000;

  const fee = 0.07 * basisPoints;

  const HiveMarketplace = await hre.ethers.getContractFactory("HiveMarketplace");
  const hiveMarketplace = await HiveMarketplace.deploy(fee, deployer.address, honey.address);

  await hiveMarketplace.deployed();

  console.log("hive marketplace deployed at address")
  console.log(hiveMarketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
