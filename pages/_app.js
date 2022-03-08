import '../styles/globals.css'
import { ThemeProvider } from "next-themes";
import { useCallback, useEffect, useReducer, createContext, useMemo} from 'react'
import { providers, ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from "web3modal";

// Components
import Layout from '../components/layout';

// Config
import { networkConfigs, getChainById } from '../config';

const getProviderOptions = (REACT_APP_INFURA_ID) => ({
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID || REACT_APP_INFURA_ID, // required
    },
  },
});

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
        tokenContract: action.tokenContract,
        auctionContract: action.auctionContract
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

const Web3Context = createContext();
let web3Modal;

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  const { provider, web3Provider, address, chainId, contract, gasGwei } = state;
  const mainnetChainId = "0x89";
  const testnetChainId = "0x13881";

  useEffect(() => {
    const providerOptions = getProviderOptions(pageProps.REACT_APP_INFURA_ID);
    if (typeof window !== 'undefined') {
      web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
      })
    }
  }, [pageProps.REACT_APP_INFURA_ID]);

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal?.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    const ethersProvider = new ethers.providers.Web3Provider(provider)
    const ethersSigner = ethersProvider.getSigner();

    // let erc20TokenContract;
    // let queensAuctionContract;

    // if (pageProps?.ENVIRONMENT === 'testnet') {
    //   erc20TokenContract = new ethers.Contract(TestErc20TokenAddress, TestErc20ABI, ethersSigner);
    //   queensAuctionContract = new ethers.Contract(TestAuctionAddress, QueenAuctionABI, ethersSigner);
    // } else {
    //   erc20TokenContract = new ethers.Contract(DaiContractAddress, DaiTokenAbi, ethersSigner);
    //   queensAuctionContract = new ethers.Contract(MainnetAuctionAddress, QueenAuctionABIMainnet, ethersSigner);
    // }
    
    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
      // tokenContract: erc20TokenContract,
      // auctionContract: queensAuctionContract
    })
  }, [pageProps?.ENVIRONMENT]);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      })
    },
    [provider]
  );

  // This will auto popup the web3modal on the first render/load
  // useEffect(() => {
  //   if (window !== 'undefined' && !web3Provider) {
  //     connect()
  //   }
  // }, [connect, web3Provider]);

  // Auto connect to the cached provider
  useEffect(() => {
    if (window !== 'undefined' && web3Modal.cachedProvider) {
      connect()
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload()
      }

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])


  // Will ask the user to switch chains if they are connected to the wrong chain
  useEffect(() => {
    if (provider && chainId !== 80001) {
      provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: testnetChainId }],
      });
      return
    }
  }, [chainId, provider, mainnetChainId, testnetChainId])

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Web3Context.Provider value={contextValue}>
        <Layout pageProps={pageProps} connect={connect} disconnect={disconnect} {...contextValue.state}>
          {/* 
            Component here is the page, for example index.js
            So if we want a sidebar or main menu on every page of the website its best to put these components in layout.js
          */}
          <Component {...pageProps} {...contextValue.state} connect={connect} />
        </Layout>
      </Web3Context.Provider>
    </ThemeProvider>
  )
}

export { Web3Context };

export default MyApp
