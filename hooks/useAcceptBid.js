import { useState, useCallback } from 'react';
import { TRANSACTION_STATUS } from '../constants/nft';
import useTokenApproval from './useTokenApproval';

export default function useAcceptBid({ marketplaceContract, fetchData, ethersProvider, marketplaceAddress, owner }) {
  const [transaction, setTransaction] = useState(null);
  const [acceptationStatus, setAcceptationStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [acceptationError, setAcceptationError] = useState(null);
  const { handleApproval, approvalStatus, approvalError, approvalTx } = useTokenApproval({ ethersProvider, marketplaceAddress, owner });

  // For the owner of the NFT to accept a bid
  const handleAcceptBid = useCallback(async function (offer) {
    // handle approval
    const approval = await handleApproval(offer?.contractAddress || offer?.collectionId);

    if (approval) return;

    try {      
      setAcceptationStatus(TRANSACTION_STATUS.IN_PROGRESS);
      const tx = await marketplaceContract.AcceptBid({
        contractAddress: offer?.contractAddress || offer?.collectionId,
        userAddress: offer.userAddress,
        tokenId: offer.tokenId,
        pricePerItem: offer.pricePerItem.toString(),
        quantity: offer.quantity,
        expiry: offer.expiry,
        nonce: offer.nonce,
        r: offer.r,
        s: offer.s,
        v: offer.v,
      });
      const txResult = await tx?.wait();
      if (txResult) {
        setTransaction(txResult);
        setAcceptationStatus(TRANSACTION_STATUS.SUCCESS);
        fetchData()
      }
    } catch (error) {
      setAcceptationStatus(TRANSACTION_STATUS.FAILED);
      setAcceptationError(error?.data?.message || error?.message);
      alert(error?.data?.message || error?.message)
      return;
    }
  }, [marketplaceContract, fetchData, handleApproval])

  return { handleAcceptBid, acceptBidTx: transaction, acceptBidStatus: acceptationStatus, acceptBidError: acceptationError, approvalStatus, approvalError }
}