import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';

export default function useCancelListing({ marketplaceContract, setIsCancelling }) {
  const [cancellationStatus, setCancellationStatus] = useState();
  const [cancellationError, setCancellationError] = useState(null);
  const [transaction, setTransaction] = useState(null);

    // For the owner of the NFT to cancel their listing
    const handleCancelListing = useCallback(async function (listing) {
      try {
        setCancellationStatus(TRANSACTION_STATUS.IN_PROGRESS);
        const tx = await marketplaceContract.CancelListing({
          contractAddress: listing?.contractAddress || listing?.collectionId,
          userAddress: listing.userAddress,
          tokenId: listing.tokenId,
          pricePerItem: listing.pricePerItem.toString(),
          quantity: listing.quantity,
          expiry: listing.expiry,
          nonce: listing.nonce,
          r: listing.r,
          s: listing.s,
          v: listing.v,
        });
        const txResult = await tx?.wait();
        console.log(`txResult`, txResult)
        if (txResult) {
          setTransaction(txResult);
          setCancellationStatus(TRANSACTION_STATUS.SUCCESS);
        }
      } catch (error) {
        setCancellationStatus(TRANSACTION_STATUS.FAILED);
        setCancellationError(error?.message);
        alert(error?.message)
        setIsCancelling && setIsCancelling(false);
      }
  
    }, [marketplaceContract, setIsCancelling])

    return { handleCancelListing, cancellationTx: transaction, cancellationStatus, cancellationError }
}