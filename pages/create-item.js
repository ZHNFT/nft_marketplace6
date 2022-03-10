import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import Image from "next/image";


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import {
    nftAddress, nftMarketAddress
} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Marketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


export default function CreateItem() {

    const [fileURL, setFileURL] = useState(null);

    const [formInput, updateFormInput] = useState({price: '', name : '', description : ''});

    const router = useRouter();

    async function onChange(e) {
        const file = e.target.files[0]
        try {

            //try upload file
            const added = await client.add(
                file,
                {
                    progress : (prog) => console.log(`recieved: ${prog}`)
                }
            )

            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileURL(url)

        } catch(e) {
            console.log(e)
        }
    }

    //1. Create item and load to ipfs
    async function createItem() {
        const {name, description, price} = formInput; //Get the value from the form input

        if(!name || !description || !price || !fileURL) return; //form verification 

        const data = JSON.stringify({
            name, description, price, image : fileURL
        })

        try {

            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`

            //pass url to save it on polygon after it has been uloaded to ipfs
            createSale(url)


        } catch(e) {

            console.log("error uploading file: ", e);

        }

    }

    async function mintNft(url) {
        
    }


    //2. List item for sale
    async function createSale(url) {

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
    
        const signer = provider.getSigner();
    
        let contract = new ethers.Contract(nftAddress, NFT.abi, signer);

        let transaction = await contract.mint(url);

        let tx = await transaction.wait();

        //Get the tokenId for the transaction that occured above
        //there events array that is returned, the first item from that event
        // is the event, third item is the token id
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        //get a reference to the price entered in the form 
        const price = ethers.utils.parseUnits(formInput.price, "ether");

        contract = new ethers.Contract(nftMarketAddress, Marketplace.abi, signer);

        //get the listing price
        let listingPrice = await contract.getListingPrice();

        listingPrice = listingPrice.toString();

        transaction = await contract.createMarketItem(nftAddress, tokenId, price, {value : listingPrice});

        tx = await transaction.wait();

        router.push('/')

    }

    return (
        <div className="flex justify-center">

            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Item Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, name : e.target.value})}
                />

                <textarea
                    placeholder="Item Description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, description : e.target.value})}
                />

                <input
                    placeholder="Item Price in ETH"
                    className="mt-8 border rounded p-4"
                    type="number"
                    onChange={e => updateFormInput({...formInput, price : e.target.value})}
                />

                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={e => onChange(e)}
                />

                {
                    fileURL && (
                        <Image className="rounded mt-4" width={350} height={500} src={fileURL} alt="" />
                    )
                }

                <button onClick={createItem} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Create NFT
                </button>

            </div>

        </div>
    )

}