import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';
import Web3Token from 'web3-token';
import useApiCall from './useApiCall';
import useTokenApproval from './useTokenApproval';
import { getSignatureListing } from '../Utils/marketplaceSignatures';

export default function useListNftForAuction({ ethersProvider, marketplaceAddress, owner, collectionId, tokenId, marketplaceContract }) {
  const { response, handleApiCall, apiStatus, apiError } = useApiCall();
  const { handleApproval, approvalStatus, approvalError, approvalTx } = useTokenApproval({ ethersProvider, marketplaceAddress, owner, collectionId });

  // For the owner of the NFT to create an auction, its not possible to cancel an auction
  const handleCreateAuction = useCallback(async function ({ price, expirationDate, percent }) {
    const signer = ethersProvider.getSigner();

    let auction = {
      collectionAddress: collectionId,
      owner: owner,
      tokenId: tokenId,
      expiry: expirationDate,
      quantity: 1,
      minBid: (Number(price) * 10 ** 18).toString(),
      percentIncrement: Number(percent) * 10, // for example 5% should be passed to the contract as 50
      highestBid: 0,
      highestBidder: '0x0000000000000000000000000000000000000000',
    }

    // handle approval
    await handleApproval();

    let token;

    try {
      // TODO: replace with jwt?
      token = await Web3Token.sign(async msg => await signer.signMessage(msg), '1d');
    } catch (error) {
      alert(error?.message)
    }

    // handle api call
    await handleApiCall({ token, endpoint: 'auctions', data: auction });

    try {
      const tx = await marketplaceContract.placeAuction(auction);
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
    } catch (error) {
      alert(error?.message)
    }

  }, [collectionId, owner, tokenId, ethersProvider, marketplaceContract, handleApproval, handleApiCall])

  return { handleCreateAuction, approvalStatus, approvalError, apiStatus, apiError };

}