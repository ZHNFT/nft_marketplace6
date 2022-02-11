const hre = require("hardhat");
module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  await deploy('NFTMarket', {
    from: deployer
  });
};
//module.exports.tags = ['NFTMarket'];