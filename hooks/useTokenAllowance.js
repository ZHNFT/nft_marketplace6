import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import { TRANSACTION_STATUS } from '../constants/nft';

export default function useTokenAllowance({ tokenContract, marketplaceAddress, address }) {
  const [allowanceStatus, setAllowanceStatus] = useState();
  const [allowanceError, setAllowanceError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const handleAllowance = useCallback(async (price) => {
    try {
      setAllowanceStatus(TRANSACTION_STATUS.IN_PROGRESS);
      const bid = Number(price);
      const bidAmount = ethers.utils.parseEther(bid.toString());
      const allowance = await tokenContract.allowance(address, marketplaceAddress);
      const allowanceString = ethers.utils.formatEther(allowance.toString())
      // if allowance is less then price/bidAmount, we need to increase the allowance
      if (Number(allowanceString) < Number(price)) {
        const allow = await tokenContract.increaseAllowance(marketplaceAddress, bidAmount);
        const allowanceResult = await allow?.wait();
        console.log(`allowanceResult`, allowanceResult)
        if (allowanceResult) {
          setTransaction(allowanceResult);
          setAllowanceStatus(TRANSACTION_STATUS.SUCCESS)
        }
      } else {
        setAllowanceStatus(TRANSACTION_STATUS.SUCCESS)
      }
    } catch (error) {
      setAllowanceStatus(TRANSACTION_STATUS.FAILED)
      setAllowanceError(error?.message);
      alert(error?.message)
    }
  }, [address, marketplaceAddress, tokenContract]);

  return { handleAllowance, allowanceStatus, allowanceError, allowanceTx: transaction }
} 