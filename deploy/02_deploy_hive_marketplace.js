module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    await deploy('HiveMarketplace', {
      from: deployer,
      log: true,
    });
  };
  module.exports.tags = ['HiveMarketplace'];