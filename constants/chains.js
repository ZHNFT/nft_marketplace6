const CHAIN_IDS = [137, 1, 43114];

const CHAINS = {
  137: { chainId: 137, name: 'polygon', label: 'Polygon', mainTokenTicker: 'HNY' },
  1: { chainId: 1, name: 'ethereum', label: 'Ethereum', mainTokenTicker: 'wETH' },
  43114: { chainId: 43114, name: 'avalanche', label: 'Avalanche', mainTokenTicker: 'wAVAX' }
};

export {
  CHAIN_IDS,
  CHAINS
};
