import Metamask from "./images/metamaskWallet.png";
import WalletConnect from "./images/wallet-connect.svg";
import TrustWallet from "./images/TrustWallet.png";

export const nftAddress = "0x6a334a45164be765F1733101A08A4a41d0581FB7"
export const nftMarketAddress = "0x832F92F785964899e043b85d9EEE5eA3699B65Cd"
export const hiveMarketplaceAddress = "0x801974E3d2A2f5c9e533E5AA663D7B09428D3093"
export const honeyTokenAddress = "0x5CFB197753a01353c3AA11db332349bebDE649cC"
export const testNFTAddress = "0x80F216E24A73203e94aEbd9ca01899F97dFf5E2F"
export const AdditionalTestNFT = "0x06E65c70B752b996E3dC0C66c8424E14B52B8266"
export const LargeTestcollection = "0xcBce509f9d84EDe4A1477985e71B35Ee77641988"
export const LargeTest = "0xAf326762057F5B7EEd46b08eB12694150cb37bca"
export const TestCollection = "0xcCC160F8cb0FC34EEbA4725A8166598f1249069b"

export const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: "injected",
    priority: 1,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: "walletconnect",
    priority: 2,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: "injected",
    priority: 3,
  }
];

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