import '../styles/globals.css'
import { ThemeProvider } from "next-themes";
import { useCallback, useEffect, useReducer, useState, useMemo} from 'react'
import { providers, ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from "web3modal";
import Web3Context from '../contexts/Web3Context';
import router from 'next/router';
import nprogress from 'nprogress';
import { getUserDetails } from '../Utils/helper';
import { CURRENCIES } from '../constants/currencies';
import AppGlobalContext from '../contexts/AppGlobalContext';
import NftActionsModal from '../components/Modals/NftActionsModal';
import { CHAIN_IDS, CHAINS} from '../constants/chains';
import { useRouter } from "next/router";

// libray styles
import 'nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Components
import Layout from '../components/layout';

// Config
import { 
  honeyTokenAddress,
  ethTokenAddress,
  maticTokenAddress,
  networkConfigs,
  getChainById, 
  marketPlaceTestABI, 
  TestErc20ABI, 
  mumbaiHoneyTokenAddress,
  mumbaiEthTokenAddress,
  mumbaiMaticTokenAddress,
  honeyAbi,
  ethAbi,
  maticAbi,
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
    case 'INIT_APP':
      return {
        ...state,
        appInit: true
      }
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
        ethTokenContract: action.ethTokenContract,
        maticTokenContract: action.maticTokenContract
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
        ethTokenBalance: action.ethTokenBalance,
        maticTokenBalance: action.maticTokenBalance
      }
    case 'SET_TOKEN_DATA':
      return {
        ...state,
        tokenData: action.tokenData,
        ethTokenData: action.ethTokenData,
        maticTokenData: action.maticTokenData
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return {
        ...initialState,
        appInit: true
      }
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
  const {
    provider,
    web3Provider,
    address,
    chainId,
    tokenContract,
    ethTokenContract,
    maticTokenContract,
    ethersProvider,
    marketplaceContract,
    tokenData,
    ethTokenData,
    maticTokenData,
    tokenBalance,
    ethTokenBalance,
    maticTokenBalance
  } = state;
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

  const loadBalance = useCallback(async function({ tokenContract, ethTokenContract, maticTokenContract, address }) {
    if (!address) return;

    if (ethTokenContract && maticTokenContract) {
      // polygon
      const [tokenBalance, ethTokenBalance, maticTokenBalance] = await Promise.all([
        tokenContract ? tokenContract.balanceOf(address) : Promise.resolve(0),
        ethTokenContract ? ethTokenContract.balanceOf(address) : Promise.resolve(0),
        maticTokenContract ? maticTokenContract.balanceOf(address) : Promise.resolve(0)
      ]);
  
      dispatch({
        type: 'SET_BALANCE',
        tokenBalance: ethers.utils.formatEther(tokenBalance.toString()),
        ethTokenBalance: ethers.utils.formatEther(ethTokenBalance.toString()),
        maticTokenBalance: ethers.utils.formatEther(maticTokenBalance.toString())
      });

      return;
    }

    // other chains
    const mainTokenBalance = await tokenContract.balanceOf(address);
    dispatch({
      type: 'SET_BALANCE',
      tokenBalance: ethers.utils.formatEther(mainTokenBalance.toString())
    });
  }, []);

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal?.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider, 'any')

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    const ethersProvider = new ethers.providers.Web3Provider(provider, 'any')
    const ethersSigner = ethersProvider.getSigner();
    
    let marketplaceContract;
    let mainTokenContract;
    let ethTokenContract;
    let maticTokenContract;
    const marketplaceAddress = CHAIN_IDS.includes(network.chainId) ? CHAINS[network.chainId]?.marketplaceAddress : CHAINS[137]?.marketplaceAddress;
    const mainTokenAddress = CHAIN_IDS.includes(network.chainId) ? CHAINS[network.chainId]?.mainTokenAddress : CHAINS[137]?.mainTokenAddress;

    if (network.chainId === 80001) {
      marketplaceContract = new ethers.Contract(marketplaceAddress, marketPlaceTestABI, ethersSigner);
      mainTokenContract = new ethers.Contract(mainTokenAddress, TestErc20ABI, ethersSigner);
      ethTokenContract = new ethers.Contract(mumbaiEthTokenAddress, TestErc20ABI, ethersSigner);
      maticTokenContract = new ethers.Contract(mumbaiMaticTokenAddress, TestErc20ABI, ethersSigner);
    } else if (network.chainId === 137) {
      marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceAbi, ethersSigner);
      mainTokenContract = new ethers.Contract(mainTokenAddress, honeyAbi, ethersSigner);
      ethTokenContract = new ethers.Contract(ethTokenAddress, ethAbi, ethersSigner);
      maticTokenContract = new ethers.Contract(maticTokenAddress, maticAbi, ethersSigner);
    } else {
      marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceAbi, ethersSigner);
      mainTokenContract = new ethers.Contract(mainTokenAddress, ethAbi, ethersSigner);
    }

    if (CHAIN_IDS.includes(network.chainId)) {
      await loadBalance({ tokenContract: mainTokenContract, ethTokenContract, maticTokenContract, address });
    }

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      ethersProvider,
      address: address,
      chainId: network.chainId,
      chainIdHex: `0x${Number(network.chainId).toString(16)}`,
      marketplaceContract,
      tokenContract: mainTokenContract,
      ethTokenContract,
      maticTokenContract
    })

    dispatch({ type: 'INIT_APP' });

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
      });
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
    } else {
      dispatch({ type: 'INIT_APP' });
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
        loadBalance({ tokenContract, ethTokenContract, maticTokenContract, ethMainaddress: accounts[0] });
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
  }, [provider, disconnect, loadBalance, tokenContract, ethTokenContract, maticTokenContract, address])


  // Will ask the user to switch chains if they are connected to the wrong chain
  useEffect(() => {
    //if (provider && !CHAIN_IDS.includes(chainId)) {
    if (provider && chainId !== 137) {
      provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain === 'polygon' ? mainnetChainId : testnetChainId }],
      });
      return
    }
  }, [chainId, provider, mainnetChainId, testnetChainId, chain])

  useEffect(() => {
    async function fetchTokenData() {
      const [honeyResponse, ethResponse, maticResponse] = await Promise.all([
        fetch(`https://api.dexscreener.io/latest/dex/tokens/${honeyTokenAddress}`),
        fetch(`https://api.dexscreener.io/latest/dex/tokens/${ethTokenAddress}`),
        fetch(`https://api.dexscreener.io/latest/dex/tokens/${maticTokenAddress}`)
      ]);
      const [honeyData, ethData, maticData] = await Promise.all([
        honeyResponse?.json(),
        ethResponse?.json(),
        maticResponse?.json()
      ]);
      dispatch({
        type: 'SET_TOKEN_DATA',
        tokenData: honeyData?.pairs[0],
        ethTokenData: ethData?.pairs[0],
        maticTokenData: maticData?.pairs[0]
      })
    }
    fetchTokenData();
  }, [])

  const handleModal = useCallback(modal => address ? setActiveModal(modal) : connect(), [address, connect]);
  
  const handleCloseModal = useCallback(function (){
    setActiveModal(null)
  }, [])

  const getTokenPriceUsd = useCallback(function ({ currency }) {
    if (currency === CURRENCIES.WETH) {
      return ethTokenData?.priceUsd;
    }
    if (currency === CURRENCIES.WMATIC) {
      return maticTokenData?.priceUsd;
    }
    return tokenData?.priceUsd;
  }, [tokenData?.priceUsd, ethTokenData?.priceUsd, maticTokenData?.priceUsd]);

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
      setIsRefetching,
      getTokenPriceUsd
    }), 
    [showEditProfileModal, user, nftData, handleModal, activeModal, handleCloseModal, shouldRefetch, setIsRefetching, isRefetching, getTokenPriceUsd]
  );

  const { asPath } = useRouter();

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
              key={asPath}
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
              contracts={{ [CURRENCIES.HNY]: tokenContract, [CURRENCIES.WETH]: ethTokenContract, [CURRENCIES.WMATIC]: maticTokenContract }}
              chainId={chainId}
              ethersProvider={ethersProvider}
              tokenId={nftData?.tokenId}
              collectionId={nftData?.collectionId}
              tokenPrices={{ [CURRENCIES.HNY]: tokenData?.priceUsd, [CURRENCIES.WETH]: ethTokenData?.priceUsd, [CURRENCIES.WMATIC]: maticTokenData?.priceUsd }}
              tokenBalances={{ [CURRENCIES.HNY]: tokenBalance, [CURRENCIES.WETH]: ethTokenBalance, [CURRENCIES.WMATIC]: maticTokenBalance }}
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
