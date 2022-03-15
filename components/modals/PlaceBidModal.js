import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import TransactionList from '../Transactions/TransactionList';
import Modal from '../modals/Modal';
import PlaceBidForm from '../Forms/PlaceBidForm';

export default function PlaceBidModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Place a bid">
      {
        formData
          ? (
            <TransactionList
              steps={[
                {
                  title: `Approval to transfer ${formData} HNY`,
                  status: TRANSACTION_STATUS.IN_PROGRESS,
                  isDefaultOpen: true,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Transfer Bid Amount',
                  status: TRANSACTION_STATUS.INACTIVE,
                  isDefaultOpen: false,
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
          )
          : <PlaceBidForm onConfirm={setFormData} />
      }
    </Modal>
  );
}
