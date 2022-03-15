import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import TransactionList from '../Transactions/TransactionList';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';

export default function CancelListingModal({ isOpen, onClose, onConfirm }) {
  const [isCanceling, setIsCancelling] = useState(false);
  if (isCanceling) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cancel Listing">
        <TransactionList
          steps={[
            {
              title: 'Transaction to cancel list',
              status: TRANSACTION_STATUS.IN_PROGRESS,
              isDefaultOpen: true,
              description: 'Description here'
            },
            {
              className: 'my-2',
              title: 'Completion',
              status: TRANSACTION_STATUS.INACTIVE,
              isDefaultOpen: false,
              description: 'Description here'
            }
          ]}
        />
      </Modal>
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
      onConfirm={setIsCancelling}
    />
  );
}