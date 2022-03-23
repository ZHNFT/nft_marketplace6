import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';

export default function useAcceptListing({ marketplaceContract, setIsConfirming }) {
  const [acceptationStatus, setAcceptationStatus] = useState();
  const [acceptationError, setAcceptationError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // For the non-owners of the NFT to buy now/accept the listing of the owner
  const handleAcceptListing = useCallback(async function (listing) {
    try {      
      // TODO increase allowance?
      const tx = await marketplaceContract.AcceptListing({
        contractAddress: listing?.contractAddress || listing?.collectionId,
        userAddress: listing.userAddress,
        tokenId: listing.tokenId,
        pricePerItem: listing.pricePerItem,
        quantity: listing.quantity,
        expiry: listing.expiry,
        nonce: listing.nonce,
        r: listing.r,
        s: listing.s,
        v: listing.v,
      });
      const txResult = await tx?.wait();
      if (txResult) {
        setTransaction(txResult);
        setAcceptationStatus(TRANSACTION_STATUS.SUCCESS);
      }
    } catch (error) {
      setAcceptationStatus(TRANSACTION_STATUS.FAILED);
      setAcceptationError(error?.message);
      alert(error?.message)
      setIsConfirming && setIsConfirming(false);
    }
  }, [marketplaceContract, setIsConfirming])

    return { handleAcceptListing, acceptationTx: transaction, acceptationStatus, acceptationError }
}