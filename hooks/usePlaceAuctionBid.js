import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';
import useApiCall from './useApiCall';
import useTokenAllowance from './useTokenAllowance';

export default function usePlaceAuctionBid({ tokenContract, marketplaceAddress, address, marketplaceContract, tokenId, collectionId, owner }) {
  const { handleAllowance, allowanceStatus, allowanceError, allowanceTx } = useTokenAllowance({ tokenContract, marketplaceAddress, address });

    // For non-owners to place a bid on an auction
    const handlePlaceAuctionBid = useCallback(async function ({ price }) {
      let offer = {
        collectionAddress: collectionId,
        owner: owner,
        tokenId: tokenId,
        amount: (Number(price) * 10 ** 18).toString(),
      };
  
      await handleAllowance(price);
  
      try {
        // offer should include collectionAddress, tokenId, owner and amount
        const tx = await marketplaceContract.placeAuctionBid(offer.collectionAddress, offer.tokenId, offer.owner, offer.amount);
        const txResult = await tx?.wait();
        console.log(`txResult`, txResult)
      } catch (error) {
        alert(error?.message)
      }
  
    }, [tokenId, collectionId, handleAllowance, marketplaceContract, owner]);

    return { handlePlaceAuctionBid, allowanceStatus, allowanceError }
}