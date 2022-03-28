import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import jwt from 'jsonwebtoken'
import { TRANSACTION_STATUS } from '../constants/nft';
import useApiCall from './useApiCall';
import useTokenApproval from './useTokenApproval';
import { getSignatureListing } from '../Utils/marketplaceSignatures';

export default function useListNft({ ethersProvider, marketplaceAddress, owner, collectionId, tokenId, chainId }) {
  const { response, handleApiCall, apiStatus, apiError } = useApiCall();
  const { handleApproval, approvalStatus, approvalError, approvalTx } = useTokenApproval({ ethersProvider, marketplaceAddress, owner, collectionId });
  const [signatureStatus, setSignatureStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [signatureError, setSignatureError] = useState(null);

  // For owner of an NFT to list the NFT
  const handleList = useCallback(async function ({ price, expirationDate }) {
    const signer = ethersProvider.getSigner();
    const nonce = await signer.getTransactionCount();

    let listing = {
      contractAddress: collectionId,
      tokenId: tokenId,
      userAddress: owner,
      // TODO fix this in correct formatting wei/gwei/eth in combination with the input value (price)
      pricePerItem: (Number(price) * 10 ** 18).toString(),
      quantity: 1,
      expiry: expirationDate,
      nonce: nonce
    }

    // handle approval
    await handleApproval();

    let signature;
    let token;

    try {
      setSignatureStatus(TRANSACTION_STATUS.IN_PROGRESS);
      ({ listing, signature } = await getSignatureListing(listing, signer, ethers, marketplaceAddress, chainId))
      token = jwt.sign({ data: signature, chain: chainId }, listing.contractAddress, { expiresIn: 60 })
      if (token) {
        setSignatureStatus(TRANSACTION_STATUS.SUCCESS);
      }
    } catch (error) {
      setSignatureStatus(TRANSACTION_STATUS.FAILED);
      setSignatureError(error?.message);
      alert(error?.message)
    }

    // handle api call
    await handleApiCall({ token, endpoint: 'listings', data: listing });

  }, [ethersProvider, chainId, tokenId, collectionId, owner, marketplaceAddress, handleApproval, handleApiCall])

  return { handleList, approvalStatus, approvalError, apiStatus, apiError, signatureStatus, signatureError };

}