import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {ethers} from "ethers"
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress } from '../config'
//import styles from '../styles/Home.module.css'
import { useMoralis } from 'react-moralis';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Marketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

// https://opensea.io/rankings?chain=matic
const NftProjects = [
  {
    chain: 'matic',
    name: 'Space Game - Marines & Aliens',
    address: '0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35'
  },
  {
    chain: 'matic',
    name: 'Chumbi Valley Official',
    address: '0x5492ef6aeeba1a3896357359ef039a8b11621b45'
  },
  {
    chain: 'matic',
    name: 'Evaverse Hoverboards',
    address: '0x9d29e9fb9622f098a3d64eba7d2ce2e8d9e7a46b'
  }
];

export default function Home(props) {
  const { collections } = props;
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const { Moralis, isInitialized, isInitializing } = useMoralis();
  const [metaData, setMetaData] = useState([]);

  useEffect(() => {
    loadNFTS();
    
  }, []);

  useEffect(async function() {
    const options = { chain: NftProjects[2].chain, address: NftProjects[2].address };
    if (isInitialized) {
      const metaData = await Moralis.Web3API.token.getNFTMetadata(options);
      setMetaData(metaData);
    }
  }, [isInitialized]);

  async function loadNFTS() {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/6b2231f7f9ab46b7a9e63b08489d305b");
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, Marketplace.abi, provider);

    const data = await marketContract.fetchMarketItems();
    const items = await Promise.all(data.map(async i => {

      const tokenURI = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenURI);
      let price = ethers.utils.formatUnits(i.price.toString(), "ether");

      let item = {
        price,
        tokenId : i.tokenId.toString(),
        seller : i.seller,
        owner : i.owner,
        image : meta.data.image,
        name : meta.data.name,
        description : meta.data.description
      }

      return item;

    }))

    setNfts(items);
    setLoadingState('loaded');

  }

  async function buyNft(nft) {

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(nftMarketAddress, Marketplace.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nftAddress, nft, nft.tokenId, {
      value : price
    });

    await transaction.wait();

    loadNFTS();

  }


  if(loadingState === 'loaded' && !nfts.length) return  (

    <h1 className='px-20 py-10 text-3xl'>No items in Marketplace</h1>

  )

  return (
    <div className='flex justify-center'>

      <div className='px-4' style={{ maxWidth :'1600px'}}>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Address
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {collections.map((collection) => (
                          <Link href="/collection/[address]" as={`collection/${collection.token_address}`} key={collection.token_address}>
                            <tr key={collection.token_address} className="hover:bg-gray-50 hover:cursor-pointer">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.token_address}</td>
                            </tr>
                          </Link>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>

          {
            nfts.map((nft, i) => (

             
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <Image
                  src={nft.image}
                  alt="image"
                  width={500}
                  height={600} 

                />

                {console.log(nft)}
                <div className='p-4'>
                  <p style={{ height : '64px'}} className='text-2xl font-semibold'>
                    {nft.name}
                  </p>
                  <div style={{ height : '70px', overflow : 'hidden'}}>
                    <p className="text-gray-400">
                      {nft.description}
                    </p>
                  </div>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-2xl mb-4 font-bold text-white'>
                    {nft.price} ETH
                  </p>
                  <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded'
                    onClick={() => buyNft(nft)}> 
                    Buy NFT 
                  </button>
                </div>
              </div>
            ))
          }

        </div>

      </div>

    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/collection');
  const data = await res?.json();
  
  return { props: { collections: [ data?.data ] }, revalidate: 30 };
}
