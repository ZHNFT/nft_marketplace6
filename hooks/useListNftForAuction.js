import { useState, useCallback } from 'react';
import { TRANSACTION_STATUS } from '../constants/nft';
import Web3Token from 'web3-token';
import { ethers } from "ethers";
import useApiCall from './useApiCall';
import useTokenApproval from './useTokenApproval';

export default function useListNftForAuction({ ethersProvider, marketplaceAddress, owner, collectionId, tokenId, marketplaceContract }) {
  const { response, handleApiCall, apiStatus, apiError } = useApiCall();
  const { handleApproval, approvalStatus, approvalError, approvalTx } = useTokenApproval({ ethersProvider, marketplaceAddress, owner });
  const [signatureStatus, setSignatureStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [signatureError, setSignatureError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [transactionError, setTransactionError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // For the owner of the NFT to create an auction, its not possible to cancel an auction
  const handleCreateAuction = useCallback(async function ({ price, expirationDate}) {
    const signer = ethersProvider.getSigner();

    let auction = {
      collectionAddress: collectionId,
      owner: owner,
      tokenId: tokenId,
      expiry: expirationDate,
      quantity: 1,
      minBid: ethers.utils.parseEther(price).toString(),
      highestBid: 0,
      highestBidder: '0x0000000000000000000000000000000000000000'
    }

    // handle approval
    const approval = await handleApproval(collectionId);

    if (approval) return;

    let token;

    try {
      setSignatureStatus(TRANSACTION_STATUS.IN_PROGRESS);
      token = await Web3Token.sign(async msg => await signer.signMessage(msg), '1d');
      if (token) {
        setSignatureStatus(TRANSACTION_STATUS.SUCCESS);
      }
    } catch (error) {
      setSignatureStatus(TRANSACTION_STATUS.FAILED);
      setSignatureError(error?.data?.message || error?.message);
      return;
    }

    // handle api call
    await handleApiCall({ token, endpoint: 'auctions', data: auction });

    try {
      setTransactionStatus(TRANSACTION_STATUS.IN_PROGRESS);
      const tx = await marketplaceContract.placeAuction(auction);
      const txResult = await tx?.wait();

      if (txResult) {
        setTransaction(txResult);
        setTransactionStatus(TRANSACTION_STATUS.SUCCESS);
      }
    } catch (error) {
      setTransactionStatus(TRANSACTION_STATUS.FAILED);
      setTransactionError(error?.data?.message || error?.message);
      return;
    }

  }, [collectionId, owner, tokenId, ethersProvider, marketplaceContract, handleApproval, handleApiCall])

  return { handleCreateAuction, approvalStatus, approvalError, apiStatus, apiError, signatureStatus, signatureError, transactionStatus, transactionError, auctionTx: transaction };

}