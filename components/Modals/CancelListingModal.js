import { useState, useEffect } from 'react';
import { getTransactionStatus } from '../../Utils/helper';
import TransactionList from '../Transactions/TransactionList';
import { TRANSACTION_STATUS, NFT_MODALS } from '../../constants/nft';
import ConfirmModal from './ConfirmModal';
import useCancelListing from '../../hooks/useCancelListing';

export default function CancelListingModal(props) {
  const { isOpen, onClose, activeListing, marketplaceContract } = props;
  const [isCanceling, setIsCancelling] = useState(false);
  const { handleCancelListing, cancellationTx: transaction, cancellationStatus, cancellationError } = useCancelListing({ marketplaceContract, setIsCancelling })

  function handleConfirm() {
    setIsCancelling(true);
    handleCancelListing(activeListing);
  }

  if (isCanceling) {
    return (
      <TransactionList
        steps={[
          {
            title: 'Transaction to cancel list',
            status: cancellationStatus,
            isDefaultOpen: true,
            description: 'Description here'
          }
        ]}
      />
    );
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Are you sure you want to cancel your listing"
      description="Canceling your listing will unpublish this sale from Hexagon and requires a transaction to make sure it will never be fulfillable."
      cancelLabel="Never mind"
      confirmLabel="Cancel listing"
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
}