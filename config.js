
import TestToken from "./contracts/TestToken.json";
import TestMarketplace from "./contracts/TestMarketplace.json";
import Marketplace from "./contracts/Marketplace.json";
import NftCollection from "./contracts/NftCollection.json";
import HoneyToken from "./contracts/Honey.json";
import wEthToken from "./contracts/wEth.json";
import wMaticToken from "./contracts/wMatic.json";

export const mumbaiMarketplaceAddress = TestMarketplace.address;
export const mumbaiHoneyTokenAddress = TestToken.address;
export const mumbaiEthTokenAddress = TestToken.address;
export const mumbaiMaticTokenAddress = TestToken.address;

export const honeyTokenAddress = HoneyToken.address;
export const ethTokenAddress = wEthToken.address;
export const maticTokenAddress = wMaticToken.address;
export const marketplaceAddress = Marketplace.address;

export const TestErc20ABI = TestToken.abi;

export const marketPlaceTestABI = TestMarketplace.abi;

export const NftCollectionABI = NftCollection.abi;

export const marketplaceAbi = Marketplace.abi;

export const honeyAbi = HoneyToken.abi;

export const ethAbi = wEthToken.abi;

export const maticAbi = wMaticToken.abi;

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const networkConfigs = {
  "0x89": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorerUrl: "https://polygonscan.com/",
  },
  "0x13881": {
    chainId: 80001,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mumbai.matic.today/",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
  },
};