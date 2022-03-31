import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import jwt from 'jsonwebtoken'
import { TRANSACTION_STATUS } from '../constants/nft';
import useApiCall from './useApiCall';
import { getSignatureOffer } from '../Utils/marketplaceSignatures';
import useTokenAllowance from './useTokenAllowance';

export default function usePlaceBid({ tokenContract, marketplaceAddress, address, ethersProvider, chainId, tokenId, collectionId }) {
  const { response, handleApiCall, apiStatus, apiError } = useApiCall();
  const { handleAllowance, allowanceStatus, allowanceError, allowanceTx } = useTokenAllowance({ tokenContract, marketplaceAddress, address });
  const [signatureStatus, setSignatureStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [signatureError, setSignatureError] = useState(null);

  // For non-owners to place a bid on an listing
    const handlePlaceBid = useCallback(async function ({ price, expirationDate }) {
      const signer = ethersProvider.getSigner();
      const nonce = await signer.getTransactionCount();
  
      let offer = {
        contractAddress: collectionId,
        tokenId: tokenId,
        userAddress: address,
        // TODO fix this in correct formatting wei/gwei/eth in combination with the input value (price)
        pricePerItem: (Number(price) * 10 ** 18).toString(),
        quantity: 1,
        expiry: expirationDate || new Date().getTime() + 864000000, // Whichever function triggers this is not returning expiry
        nonce: nonce
      }
  
      await handleAllowance(price);
  
      let signature;
      let token;

      try {
        setSignatureStatus(TRANSACTION_STATUS.IN_PROGRESS);
        ({ offer, signature } = await getSignatureOffer(offer, signer, ethers, marketplaceAddress, chainId))
  
        token = jwt.sign({ data: signature, chain: chainId }, offer.contractAddress, { expiresIn: 60 })
        if (token) {
          setSignatureStatus(TRANSACTION_STATUS.SUCCESS);
        }
      } catch (error) {
        setSignatureStatus(TRANSACTION_STATUS.FAILED);
        setSignatureError(error?.data?.message || error?.message);
        alert(error?.data?.message || error?.message)
        return;
      }

      // handle api call
      await handleApiCall({ token, endpoint: 'bids', data: offer });
  
    }, [ethersProvider, chainId, tokenId, collectionId, address, marketplaceAddress, handleAllowance, handleApiCall]);

    return { handlePlaceBid, allowanceStatus, allowanceError, apiStatus, apiError, signatureStatus, signatureError }
}