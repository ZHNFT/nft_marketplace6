

import AvalancheLogo from "../images/logo-avalanche.svg";
import EthereumLogo from "../images/logo-ethereum.svg";
import PolygonLogo from "../images/logo-polygon.svg";
import BNBlogo from "../images/logo-bnb.svg";

const CHAIN_IDS = [80001, 137, 1, 43114, 56];

const CHAINS = {
  80001: {
    chainId: 80001,
    name: 'mumbaiTestnet',
    label: 'Mumbai Testnet',
    marketplaceAddress: '0x20ed209B16EF395db0F0031A1bbf0F17CA5Aaca4',
    mainTokenAddress: '0x7c4Fcdc9263620c57958b309633C5d42b7c3502D',
    mainTokenTicker: 'HNY',
    logo: PolygonLogo,
    hide: true
  },
  137: {
    chainId: 137,
    name: 'polygon',
    label: 'Polygon',
    marketplaceAddress: '0xF99BB7e6bEdA2Bb7d0c38b1dE90634E9F6F94D5A',
    mainTokenAddress: '0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a',
    mainTokenTicker: 'HNY',
    logo: PolygonLogo
  },
  1: {
    chainId: 1,
    name: 'ethereum',
    label: 'Ethereum',
    marketplaceAddress: '0xee4b7c58fc330a5818c6211658f6b1898d44c9d4',
    mainTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    mainTokenTicker: 'wETH',
    logo: EthereumLogo
  },
  43114: {
    chainId: 43114,
    name: 'avalanche',
    label: 'Avalanche',
    marketplaceAddress: '0xee4b7c58fc330a5818c6211658f6b1898d44c9d4',
    mainTokenAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    mainTokenTicker: 'wAVAX',
    logo: AvalancheLogo
  },
  56: {
    chainId: 56,
    name: 'binanceSmartChain',
    label: 'BNB',
    marketplaceAddress: '0xee4b7c58fc330a5818c6211658f6b1898d44c9d4',
    mainTokenAddress: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    mainTokenTicker: 'wBNB',
    logo: BNBlogo
  }
};

export {
  CHAIN_IDS,
  CHAINS
};
