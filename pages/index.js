import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {ethers} from "ethers"
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress } from '../config'
//import styles from '../styles/Home.module.css'
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Marketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import CollectionCard from '../components/Collection/CollectionCard'

// https://opensea.io/rankings?chain=matic
const NftProjects = [
  {
    chain: 'matic',
    name: 'YOCOnauts',
    address: '0x5f73f4d79580d855dee138557d1c1fb0bbb3af95',
  },
  {
    chain: 'matic',
    name: 'TestNet',
    address: '0xaf326762057f5b7eed46b08eb12694150cb37bca',
  },
];

export default function Home(props) {
  const { collections } = props;

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [metaData, setMetaData] = useState([]);

  useEffect(() => {
    loadNFTS();
    
  }, []);

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
    <div className="flex justify-center lg:max-w-6xl mx-auto">

      <div className="px-4">
          <div className="flex flex-col">
            <Hero />
            <HeroCards />

            <section className="mt-14 mb-4">
              <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
              <ul role="list" className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-2 xl:gap-x-8">
                  {collections?.results?.map((collection, index) => (
                    <li
                      key={`${collection.id}_${index}`}
                      className="mx-auto">
                    <CollectionCard collection={collection} />
                    </li>
                  ))}
              </ul>
            </section>
          </div>

          <div>
            
                  <table className="min-w-full divide-y divide-gray-200 hidden">
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Slug
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Chain
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {collections?.results?.map((collection) => (
                        <Link href="/collections/[address]" as={`/collections/${collection.address}`} key={collection.address} passHref>
                            <tr key={collection.address} className="hover:bg-gray-50 cursor-pointer">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.address}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.slug}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.chain}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collection.totalSupply}</td>
                            </tr>
                          </Link>
                      ))}
                    </tbody>
                  </table>
          </div>
      </div>

    </div>
  )
}

export async function getStaticProps() {
  const url = "https://hexagon-api.onrender.com/collections?page=0&size=2&sort=name&chain=mumbai"
  const res = await fetch(url)
  const data = await res?.json()
  return { props: { collections: data }, revalidate: 30 };
}
