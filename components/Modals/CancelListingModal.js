import { useState, useEffect } from 'react';
import { getTransactionStatus } from '../../Utils/helper';
import TransactionList from '../Transactions/TransactionList';
import { TRANSACTION_STATUS, NFT_MODALS } from '../../constants/nft';
import useCancelListing from '../../hooks/useCancelListing';
import PrimaryButton from '../Buttons/PrimaryButton';

export default function CancelListingModal(props) {
  const { isOpen, handleClose, activeListing, marketplaceContract, title,
    description,
    confirmLabel = 'OK',
    fetchData
  } = props;
  const [isCanceling, setIsCancelling] = useState(false);
  const { handleCancelListing, cancellationTx: transaction, cancellationStatus, cancellationError } = useCancelListing({ marketplaceContract, setIsCancelling })

  async function handleConfirm() {
    setIsCancelling(true);
    await handleCancelListing(activeListing);
    fetchData();
    handleClose();
  }

  if (isCanceling) {
    return (
      <TransactionList
        steps={[
          {
            title: 'Transaction to cancel list',
            status: cancellationStatus,
            isDefaultOpen: true,
            description: cancellationError ? cancellationError : 'Description here'
          }
        ]}
      />
    );
  }

  return (
    <div className="relative inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg w-full">
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <div className="mt-2">
            <p className="text-sm text-[#969EAB]">
              { description }
            </p>
          </div>
      </div>
    </div>
    <div className="px-4 pt-3 pb-4 sm:px-6 sm:flex sm:flex-row-reverse pt-6">
      <PrimaryButton
        className="ml-4"
        type="button"
        onClick={handleConfirm}
      >
        { confirmLabel }
      </PrimaryButton>
    </div>
  </div>
  );
}