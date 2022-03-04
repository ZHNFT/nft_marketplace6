require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();
const projectID = "6b2231f7f9ab46b7a9e63b08489d305b";

//require('hardhat-deploy');
//import 'hardhat-deploy-ethers';
//require('hardhat-deploy-ethers')


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

//const {POLYGONSCAN_API_KEY } = process.env;

module.exports = {

  networks : {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/6b2231f7f9ab46b7a9e63b08489d305b`,
      accounts: [privateKey],
      gasPrice: 35000000000

    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/6b2231f7f9ab46b7a9e63b08489d305b`,
      accounts: [privateKey]
      
    }
  },

  etherscan: {
    apiKey: "23TTJA3YVBMN572QJ3ANNJAGH78NC564YB",
  },

  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  solidity: "0.8.10",
};
