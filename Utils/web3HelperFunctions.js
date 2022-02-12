import {ethers} from "ethers"
import Web3Modal from 'web3modal'
import { nftAddress, nftMarketAddress, honeyTokenAddress, hiveMarketplaceAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Marketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import HoneyToken from '../artifacts/contracts/HoneyTestToken.sol/HoneyTestToken.json'
import HiveMarketplace from '../artifacts/contracts/HiveMarketplace.sol/HiveMarketplace.json'

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

    let numberTokens = await contract.balanceOf(address)

    numberTokens = ethers.utils.formatEther(numberTokens.toString());

    // let num = numberTokens.wait();

    console.log("number tokens: ")
    console.log(numberTokens);

    

    return numberTokens.toString();

}