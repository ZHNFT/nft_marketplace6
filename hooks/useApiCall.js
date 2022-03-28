import { useState, useCallback } from 'react';
import { TRANSACTION_STATUS } from '../constants/nft';

export default function useApiCall() {
  const [apiCallStatus, setApiCallStatus] = useState(TRANSACTION_STATUS.INACTIVE);
  const [apiError, setApiError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleApiCall = useCallback(async function({ endpoint, data, token }) {
    if(!token) return;

    setApiCallStatus(TRANSACTION_STATUS.IN_PROGRESS);

    const response = await fetch(`https://hexagon-api.onrender.com/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    console.log(`response`, response)
    setApiResponse(response);

    if (!response.ok) {
      const error = await response?.json();
      console.log('API error message:', error?.message)
      setApiError(error?.message);
      setApiCallStatus(TRANSACTION_STATUS.FAILED);
      alert(error?.message)
    } else {
      setApiCallStatus(TRANSACTION_STATUS.SUCCESS);
    }
  }, []);

  return {response: apiResponse, handleApiCall, apiCallStatus, apiError};
}