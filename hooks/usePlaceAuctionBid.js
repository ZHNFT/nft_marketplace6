import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';
import useTokenAllowance from './useTokenAllowance';

export default function usePlaceAuctionBid({ tokenContract, marketplaceAddress, address, marketplaceContract, tokenId, collectionId, owner }) {
  const { handleAllowance, allowanceStatus, allowanceError, allowanceTx } = useTokenAllowance({ tokenContract, marketplaceAddress, address });
  const [transactionStatus, setTransactionStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [transactionError, setTransactionError] = useState(null);
  const [transaction, setTransaction] = useState(null);

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
        setTransactionStatus(TRANSACTION_STATUS.IN_PROGRESS);
        // offer should include collectionAddress, tokenId, owner and amount
        const tx = await marketplaceContract.placeAuctionBid(offer.collectionAddress, offer.tokenId, offer.owner, offer.amount);
        const txResult = await tx?.wait();

        if (txResult) {
          setTransaction(txResult);
          setTransactionStatus(TRANSACTION_STATUS.SUCCESS);
        }
      } catch (error) {
        setTransactionStatus(TRANSACTION_STATUS.FAILED);
        setTransactionError(error?.data?.message || error?.message);
        alert(error?.data?.message || error?.message)
        return;
      }
  
    }, [tokenId, collectionId, handleAllowance, marketplaceContract, owner]);

    return { handlePlaceAuctionBid, allowanceStatus, allowanceError, transactionStatus, transactionError }
}