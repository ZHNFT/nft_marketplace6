import '../styles/globals.css'
import { ThemeProvider } from "next-themes";
import { useCallback, useEffect, useReducer, useState, useMemo} from 'react'
import { providers, ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from "web3modal";
import Web3Context from '../contexts/Web3Context';
import router from 'next/router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.css';
import { getUserDetails } from '../Utils/helper';
import AppGlobalContext from '../contexts/AppGlobalContext';
import NftActionsModal from '../components/Modals/NftActionsModal';

// Components
import Layout from '../components/layout';

// Config
import HoneyToken from '../artifacts/contracts/HoneyTestToken.sol/HoneyTestToken.json'
import { 
  honeyTokenAddress,
  marketplaceAddress, 
  networkConfigs,
  getChainById, 
  mumbaiMarketplaceAddress,
  marketPlaceTestABI, 
  TestErc20ABI, 
  mumbaiHoneyTokenAddress,
  honeyAbi,
  marketplaceAbi
} from '../config';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // required
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
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_BALANCE':
      return {
        ...state,
        tokenBalance: action.tokenBalance,
      }
    case 'SET_TOKEN_DATA':
      return {
        ...state,
        tokenData: action.tokenData,
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
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  const { provider, web3Provider, address, chainId, tokenContract, ethersProvider, marketplaceContract, tokenData, tokenBalance } = state;
  const mainnetChainId = "0x89";
  const testnetChainId = "0x13881";

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [user, setUser] = useState({});

  const [activeModal, setActiveModal] = useState(null);
  const [nftData, setNftData] = useState({});
  const [shouldRefetch, setShouldRefetch] = useState(null);
  const [isRefetching, setIsRefetching] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
      })
    }
  }, []);

  const loadBalance = useCallback(async function(erc20TokenContract, address) {
    if (!erc20TokenContract || !address) return;
    let erc20TokenBalance = await erc20TokenContract?.balanceOf(address);
    erc20TokenBalance = ethers.utils.formatEther(erc20TokenBalance.toString());

    dispatch({
      type: 'SET_BALANCE',
      tokenBalance: erc20TokenBalance
    });
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
    
    let marketplaceContract;
    let erc20TokenContract;

    if (network.chainId === 80001) {
      marketplaceContract = new ethers.Contract(mumbaiMarketplaceAddress, marketPlaceTestABI, ethersSigner);
      erc20TokenContract = new ethers.Contract(mumbaiHoneyTokenAddress, TestErc20ABI, ethersSigner);
    }
    if (network.chainId === 137) {
      marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceAbi, ethersSigner);
      erc20TokenContract = new ethers.Contract(honeyTokenAddress, honeyAbi, ethersSigner);
    }

    await loadBalance(erc20TokenContract, address);

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      ethersProvider,
      address: address,
      chainId: network.chainId,
      chainIdHex: network.chainId === 137 
        ? mainnetChainId 
        : network.chainId === 80001 
          ? testnetChainId 
          : null,
      marketplaceContract,
      tokenContract: erc20TokenContract,
    })

    // Pull in user details once the user has connected
    // and we have their address.
    const userData = await getUserDetails(address);
    setUser(userData.user);
  }, [loadBalance]);

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
        loadBalance(tokenContract, accounts[0]);
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload()
        loadBalance(tokenContract, address);
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
  }, [provider, disconnect, loadBalance, tokenContract, address])


  // Will ask the user to switch chains if they are connected to the wrong chain
  useEffect(() => {
    if (provider && chainId !== 80001 && chain === 'mumbai') {
      provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: testnetChainId }],
      });
      return
    }
    if (provider && chainId !== 137 && chain === 'polygon') {
      provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: mainnetChainId }],
      });
      return
    }
  }, [chainId, provider, mainnetChainId, testnetChainId, chain])

  useEffect(() => {
    async function fetchTokenData() {
      const hnyAddress = '0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a';
      const response = await fetch(`https://api.dexscreener.io/latest/dex/tokens/${hnyAddress}`);
      const data = await response?.json()
      const firstPair = data?.pairs[0];
      dispatch({
        type: 'SET_TOKEN_DATA',
        tokenData: firstPair,
      })
    }
    fetchTokenData();
  }, [])

  const handleModal = useCallback(modal => address ? setActiveModal(modal) : connect(), [address, connect]);
  
  const handleCloseModal = useCallback(function (){
    setActiveModal(null)
  }, [])

  const globalContextValue = useMemo(
    () => ({ 
      showEditProfileModal, 
      setShowEditProfileModal, 
      user, 
      setUser, 
      nftData, 
      setNftData, 
      handleModal, 
      activeModal, 
      handleCloseModal, 
      shouldRefetch, 
      isRefetching,
      setIsRefetching
    }), 
    [showEditProfileModal, user, nftData, handleModal, activeModal, handleCloseModal, shouldRefetch, setIsRefetching, isRefetching]
  );

  return (
    <ThemeProvider enableSystem={true} attribute="class" defaultTheme="dark">
      <Web3Context.Provider value={contextValue}>
        <AppGlobalContext.Provider value={globalContextValue}>
          <Layout pageProps={pageProps} connect={connect} disconnect={disconnect} {...contextValue.state}>
            {/*
              Component here is the page, for example index.js
              So if we want a sidebar or main menu on every page of the website its best to put these components in layout.js
            */}
            <Component
              {...pageProps}
              {...globalContextValue}
              {...contextValue.state}
              shouldRefetch={shouldRefetch}
              handleCloseModal={handleCloseModal}
              setShouldRefetch={setShouldRefetch}
              connect={connect}
              setIsRefetching={setIsRefetching}
            />
            <NftActionsModal
              isOpen={activeModal !== null}
              onClose={handleCloseModal}
              activeModal={activeModal}
              marketplaceAddress={marketplaceContract?.address}
              marketplaceContract={marketplaceContract}
              address={address}
              tokenContract={tokenContract}
              chainId={chainId}
              ethersProvider={ethersProvider}
              tokenId={nftData?.tokenId}
              collectionId={nftData?.collectionId}
              tokenPriceUsd={tokenData?.priceUsd}
              tokenBalance={tokenBalance}
              loadBalance={loadBalance}
              setShouldRefetch={setShouldRefetch}
              isRefetching={isRefetching}
            />
          </Layout>
        </AppGlobalContext.Provider>
      </Web3Context.Provider>
    </ThemeProvider>
  )
}

export default MyApp
