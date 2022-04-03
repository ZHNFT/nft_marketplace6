import { useState, useCallback } from 'react';
import { TRANSACTION_STATUS } from '../constants/nft';
import useTokenAllowance from './useTokenAllowance';
import { formatEther } from '../Utils/helper';

export default function useAcceptListing({ marketplaceContract, tokenContract, marketplaceAddress, address }) {
  const { handleAllowance, allowanceStatus, allowanceError, allowanceTx } = useTokenAllowance({ tokenContract, marketplaceAddress, address });
  const [acceptationStatus, setAcceptationStatus] = useState();
  const [acceptationError, setAcceptationError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // For the non-owners of the NFT to buy now/accept the listing of the owner
  const handleAcceptListing = useCallback(async function (listing) {

    await handleAllowance(formatEther(listing?.pricePerItem));

    try {      
      const tx = await marketplaceContract.AcceptListing({
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
      if (txResult) {
        setTransaction(txResult);
        setAcceptationStatus(TRANSACTION_STATUS.SUCCESS);
      }
    } catch (error) {
      setAcceptationStatus(TRANSACTION_STATUS.FAILED);
      setAcceptationError(error?.data?.message || error?.message);
      return;
    }
  }, [marketplaceContract, handleAllowance])

    return { handleAcceptListing, acceptationTx: transaction, acceptationStatus, acceptationError, allowanceStatus, allowanceError }
}