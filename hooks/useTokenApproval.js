import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';
import { NftCollectionABI } from '../config';

export default function useTokenApproval({ ethersProvider, marketplaceAddress, owner }) {
  const [approvalStatus, setApprovalStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [approvalError, setApprovalError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const handleApproval = useCallback(async function(collectionId) {
    const signer = ethersProvider.getSigner();
    const nftContract = new ethers.Contract(collectionId, NftCollectionABI, signer);
    try {
      setApprovalStatus(TRANSACTION_STATUS.IN_PROGRESS);
      const isApprovedForAll = await nftContract.isApprovedForAll(owner, marketplaceAddress);
      if (!isApprovedForAll) {
        const tx = await nftContract.setApprovalForAll(marketplaceAddress, true);
        const txResult = await tx?.wait();

        if (txResult) {
          setTransaction(txResult);
          setApprovalStatus(TRANSACTION_STATUS.SUCCESS)
        }
      } else {
        setApprovalStatus(TRANSACTION_STATUS.SUCCESS)
      }
    } catch (error) {
      setApprovalStatus(TRANSACTION_STATUS.FAILED)
      setApprovalError(error?.data?.message || error?.message);
      return error?.data?.message || error?.message;
    }
  }, [ethersProvider, marketplaceAddress, owner])

  return { handleApproval, approvalStatus, approvalError, approvalTx: transaction }
}