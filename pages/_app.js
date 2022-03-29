import '../styles/globals.css'
import { ThemeProvider } from "next-themes";
import { useCallback, useEffect, useReducer, createContext, useState, useMemo} from 'react'
import { providers, ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from "web3modal";
import Web3Context from '../contexts/Web3Context';
import router from 'next/router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import HoneyToken from '../artifacts/contracts/HoneyTestToken.sol/HoneyTestToken.json'
import { honeyTokenAddress } from '../config'
import { fetcher } from '../Utils/helper';
import AppGlobalContext from '../contexts/AppGlobalContext';

// Components
import Layout from '../components/layout';

// Config
import { networkConfigs, getChainById, marketplaceTestContractAddress, marketPlaceTestABI, TestErc20ABI, TestErc20TokenAddress } from '../config';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID, // required
    },
  },
};

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

// trigger progress bar on router events
nprogress.configure({ showSpinner: false });
router.events.on('routeChangeStart', () => nprogress.start());
router.events.on('routeChangeComplete', () => nprogress.done());
router.events.on('routeChangeError', () => nprogress.done());

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
        chainIdHex: action.chainIdHex,
        ethersProvider: action.ethersProvider,
        marketplaceContract: action.marketplaceContract,
        tokenContract: action.tokenContract,
        tokenBalance: action.tokenBalance,
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

let web3Modal;

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  const { provider, web3Provider, address, chainId } = state;
  const mainnetChainId = "0x89";
  const testnetChainId = "0x13881";

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [user, setUser] = useState({});
  const globalContextValue = {
    showEditProfileModal,
    setShowEditProfileModal,
    user,
    setUser
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
      })
    }
  }, []);

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
    const marketplaceTestContract = new ethers.Contract(marketplaceTestContractAddress, marketPlaceTestABI, ethersSigner);
    const erc20TokenContract = new ethers.Contract(TestErc20TokenAddress, TestErc20ABI, ethersSigner);

    let erc20TokenBalance = await erc20TokenContract?.balanceOf(address);

    erc20TokenBalance = ethers.utils.formatEther(erc20TokenBalance.toString());

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      ethersProvider,
      address,
      chainId: network.chainId,
      chainIdHex: network.chainId === 137 
        ? mainnetChainId 
        : network.chainId === 80001 
          ? testnetChainId 
          : null,
      marketplaceContract: marketplaceTestContract,
      tokenContract: erc20TokenContract,
      tokenBalance: erc20TokenBalance
    })

    // Pull in user details once the user has connected
    // and we have their address.
    getUserDetails(address);
  }, []);

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

  async function getUserDetails(address) {
    if (address) {
      const data = await fetcher(`https://hexagon-api.onrender.com/users/${address}`);
      setUser(data.user);
    }
  }

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Web3Context.Provider value={contextValue}>
        <AppGlobalContext.Provider value={globalContextValue}>
          <Layout pageProps={pageProps} connect={connect} disconnect={disconnect} {...contextValue.state}>
            {/*
              Component here is the page, for example index.js
              So if we want a sidebar or main menu on every page of the website its best to put these components in layout.js
            */}
            <Component {...pageProps} {...contextValue.state} connect={connect} />
          </Layout>
        </AppGlobalContext.Provider>
      </Web3Context.Provider>
    </ThemeProvider>
  )
}

export default MyApp
