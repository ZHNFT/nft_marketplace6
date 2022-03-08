import Image from 'next/image'

import yellowph from "../images/nftObject.png";
import redph from "../images/nftph.png";
import AddGalleryObjects from './components/addGalleryObject';
import SearchBar from './components/searchbar';

import { ethers } from "ethers";
import Web3Modal from "web3modal";

import axios from "axios"
import { useEffect, useState } from "react";


import {
    nftAddress
} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function Gallery2() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded');

    async function fetchIPFSDoc(ipfsHash) {

        const url = setIpfsAddress(ipfsHash);
        
        const response = await fetch(url);
        return await response.json();
    }

    function setIpfsAddress(ipfsHash) {
        let hash = ipfsHash.split("://")[1]
        const url = `https://ipfs.io/ipfs/${hash}`;
        return url;
    }

    async function loadNfts(contractAddress, skip) {

        contractAddress = contractAddress.toLowerCase();


        let totalSupply = await nftContract?.totalSupply();

        const items = await Promise.all(results.map(async (i, index) => {
            const object = i.attributes;

            const tokenUri = object.uri;

            let data = await fetchIPFSDoc(tokenUri);

            let image = setIpfsAddress(data.image);

            let price = 0.3;

            let item = {
                price,
                tokenId : object.tokenId,
                image : image,
                name : data.name,
                collection : "Test Collection",
                collectionAddress : object.contractAddress
            }

            return item;
        }))


        // let promises = [];

        // for(let i = 0; i < totalSupply; i++) {

        //     promises.push(nftContract.tokenURI(i));

        // }

        // let result = await Promise.all(promises);

        // console.log(result)

        // const items = await Promise.all(result.map(async (i, index) => {

        //     console.log("i = ")
        //     console.log(i);

        //     console.log("index =")
        //     console.log(index)

        //     //const tokenUri = i.toString();
        //     const meta = await axios.get(i);

        //     console.log(meta);
        //     let price = 0.3;

        //     let item = {
        //         price,
        //         tokenId : index,
        //         image : meta.data.image,
        //         name : meta.data.name,
        //         collection : "Test Collection",
        //         collectionAddress : nftContract.address
        //     }

        //     return item;

        // }))

        // console.log(items);

        setNfts(items)
        setLoadingState('loaded')

        //console.log(result);

    }

    if(loadingState === "loaded" && !nfts.length) return (
        <h1 className="py-10 px-20 text-black">No assets owned</h1>
    )

    return(
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Collection Gallery</h2>
                {SearchBar()}

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {AddGalleryObjects(nfts)}

                </div>
            </div>
        </div>

    )
}