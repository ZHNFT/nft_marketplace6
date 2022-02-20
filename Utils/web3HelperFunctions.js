import {ethers} from "ethers"
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress, honeyTokenAddress, hiveMarketplaceAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Marketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import HoneyToken from '../artifacts/contracts/HoneyTestToken.sol/HoneyTestToken.json'
import HiveMarketplace from '../artifacts/contracts/HiveMarketplace.sol/HiveMarketplace.json'

//todo: insert the marketplace contract address
const marketplaceContractAddress = ""

export async function ClaimTokens(amountToClaim) {

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(honeyTokenAddress, HoneyToken.abi, signer);

    amountToClaim = ethers.utils.parseUnits(amountToClaim.toString(), 'ether');
    const transaction = await contract.createTokens(amountToClaim);

    await transaction.wait();

    //await GetNumberTokens();

}

export async function GetNumberTokens() {

    console.log("getting number tokens");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    let address = await signer.getAddress();

    console.log("address = ")
    console.log(address);

    const contract = new ethers.Contract(honeyTokenAddress, HoneyToken.abi, provider);

    let numberTokens = await contract?.balanceOf(address)

    numberTokens = ethers.utils.formatEther(numberTokens.toString());

    // let num = numberTokens.wait();

    console.log("number tokens: ")
    console.log(numberTokens);

    

    return numberTokens.toString();

}

/// @dev 
//Requests a signature from the provided signer, verifying the parameters of the listing object, allowing for a sale
// listing has these values : {
    //         "name": "nftContractAddress",
    //         "type": "address"
    //         },
    //         {
    //             "name": "tokenId",
    //             "type": "uint256"
    //         },
    //         {
    //             "name": "owner",
    //             "type": "address"
    //         },
    //         {
    //             "name": "pricePerItem",
    //             "type": "uint256"
    //         },
    //         {
    //             "name": "quantity",
    //             "type": "uint256"
    //         },
    //         {
    //             "name": "expiry",
    //             "type": "uint256"
    //         },
    //         {
    //             "name": "nonce",
    //             "type": "uint256"
    //         }
//}

//returns the listing object with additional values : v : uint8, r : bytes32, s : bytes32
export async function SignListing(listing, signer) {


     //TODO: this has to be changed when we go live, have to change the chainId to the live version
    //consider having this set as a parameter that is passed in
    const domain = {

        name : "HIVENFTMarketplace",
        version : "1",
        chainId : 13881,
        verifyingContract : address
    
    }

    const types = {

        "AcceptListing": [{
            "name": "nftContractAddress",
            "type": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "pricePerItem",
                "type": "uint256"
            },
            {
                "name": "quantity",
                "type": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ]
        
    };

    // The data to sign
    const value = {
        nftContractAddress: listing.nftContractAddress,
        tokenId : listing.tokenId,
        owner : listing.owner,
        pricePerItem : listing.pricePerItem,
        quantity : listing.quantity,
        expiry : listing.expiry,
        nonce : listing.nonce
    };

    let signature = await signer._signTypedData(domain, types, value);

    const verifiedAddress = ethers.utils.verifyTypedData(
        domain,
        types,
        value,
        signature
    );

    console.log("Is signing address the same as recovered from signature:")
    console.log(verifiedAddress == signer.address);

    let splitSignature = ethers.utils.splitSignature(signature);

    listing.v = splitSignature.v;
    listing.r = splitSignature.r;
    listing.s = splitSignature.s;

    return listing;

}

/// @dev 
//Requests a signature from the provided signer, verifying the parameters of the bid object, allowing for a sale
// bid has these values :  
//     {
//         "name": "nftContractAddress",
//         "type": "address"
//     },
//     {
//         "name": "tokenId",
//         "type": "uint256"
//     },
//     {
//         "name": "bidder",
//         "type": "address"
//     },
//     {
//         "name": "pricePerItem",
//         "type": "uint256"
//     },
//     {
//         "name": "quantity",
//         "type": "uint256"
//     },
//     {
//         "name": "expiry",
//         "type": "uint256"
//     },
//     {
//         "name": "nonce",
//         "type": "uint256"
//     }
// ]
//}

//returns the bid object with additional values : v : uint8, r : bytes32, s : bytes32
export async function SignBid(bid, signer) {


    //TODO: this has to be changed when we go live, have to change the chainId to the live version
    const domain = {

        name : "HIVENFTMarketplace",
        version : "1",
        chainId : 13881,
        verifyingContract : address
    
    }

    const types = {

        "AcceptBid": [{
                "name": "nftContractAddress",
                "type": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "name": "bidder",
                "type": "address"
            },
            {
                "name": "pricePerItem",
                "type": "uint256"
            },
            {
                "name": "quantity",
                "type": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ]
        
    };

    // The data to sign
    const value = {
        nftContractAddress: bid.nftContractAddress,
        tokenId : bid.tokenId,
        bidder : bid.owner,
        pricePerItem : bid.pricePerItem,
        quantity : bid.quantity,
        expiry : bid.expiry,
        nonce : bid.nonce
    };

    let signature = await signer._signTypedData(domain, types, value);

    const verifiedAddress = ethers.utils.verifyTypedData(
        domain,
        types,
        value,
        signature
    );

    console.log("Is signing address the same as recovered from signature:")
    console.log(verifiedAddress == signer.address);

    let splitSignature = ethers.utils.splitSignature(signature);

    bid.v = splitSignature.v;
    bid.r = splitSignature.r;
    bid.s = splitSignature.s;

    return bid;

    //console.log(splitSignature);

}

// export async function ListItem(listing) {

//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);

//     const signer = provider.getSigner();

//     let address = await signer.getAddress();

//     const contract = new ethers.Contract(hiveMarketplaceAddress, HiveMarketplace.abi, signer);

//     await contract.createListing(
//         listing.nftAddress,
//         listing.tokenId,
//         listing.quantity,
//         listing.pricePerItem,
//         listing.expirationTime
//     )



// }

