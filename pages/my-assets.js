import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios"
import { useEffect, useState } from "react";

import {
    nftAddress, nftMarketAddress
} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Marketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Image from "next/image";


export default function MyAssets() {

    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded');


    useEffect(() => {

        loadNfts()

    }, [])

    async function loadNfts() {

        const web3Modal = new Web3Modal();

        const connection = await web3Modal.connect();

        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner()

        let marketContract = new ethers.Contract(nftMarketAddress, Marketplace.abi, signer);
        let nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);

        const data = await marketContract.fetchMyNFTS();

        const items = await Promise.all(data.map(async i => {

            const tokenUri = await nftContract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

            let item = {
                price,
                tokenId : i.tokenId.toNumber(),
                seller : i.seller,
                owner : i.owner,
                image : meta.data,image
            }

            return item;


        }))

        setNfts(items)
        setLoadingState('loaded')

    }

    if(loadingState === "loaded" && !nfts.length) return (
        <h1 className="py-10 px-20 text-black">No assets owned</h1>
    )

    return (
        <div className="flex justify-center">

            <div className="p-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">

                    {
                        nfts.map((nft, i) => (

                            <div key={i} className="border shadow rounded-xl overflow-hidden">

                                {console.log(nft)}

                                <Image src={nft.image}
                                    alt="empty"
                                    className="rounded"
                                    width={350}
                                    height={500}
                                />

                                <div className="p-4 bg-black">

                                    <p className="text-2xl font-bold text-white">Price - {nft.price} ETH</p>
                                    
                                </div>

                            </div>



                        ))
                    }

                </div>

            </div>

        </div>
    )

}
