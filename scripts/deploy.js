// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

let owner, addr1, addr2, addr3, addr4, addr5;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  [owner, addr1, addr2, addr3, addr4, addr5, ...addrs] = await hre.ethers.getSigners();

  let feeAllocations = [{wallet : "0xA01A05665B010b041199030115A502a9a32687a1", percent : 10000}];

  //We get the contract to deploy
  const Market = await hre.ethers.getContractFactory("HexagonMarketplace");
  const market = await Market.deploy();

  await market.deployed();

  

  //set test honey token as payment method
  await market.setPaymentToken("0x7c4Fcdc9263620c57958b309633C5d42b7c3502D", 0, 0);

  await market.setFeeAllocations(feeAllocations);

  await market.addToWhitelist("0xcBce509f9d84EDe4A1477985e71B35Ee77641988", "0xA01A05665B010b041199030115A502a9a32687a1", 300, 0);

  await market.addToWhitelist("0xAf326762057F5B7EEd46b08eB12694150cb37bca", "0xA01A05665B010b041199030115A502a9a32687a1", 300, 0);

  await market.addToWhitelist("0xcCC160F8cb0FC34EEbA4725A8166598f1249069b", "0xA01A05665B010b041199030115A502a9a32687a1", 300, 0);

  await market.addToWhitelist("0x06E65c70B752b996E3dC0C66c8424E14B52B8266", "0xA01A05665B010b041199030115A502a9a32687a1", 300, 0);

  await market.addToWhitelist("0x80F216E24A73203e94aEbd9ca01899F97dFf5E2F", "0xA01A05665B010b041199030115A502a9a32687a1", 300, 0);

  await market.addToWhitelist("0x6a334a45164be765F1733101A08A4a41d0581FB7", "0xA01A05665B010b041199030115A502a9a32687a1", 300, 0);



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
