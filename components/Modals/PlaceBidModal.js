import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import { getTransactionStatus } from '../../Utils/helper';
import TransactionList from '../Transactions/TransactionList';
import Modal from '../Modals/Modal';
import PlaceBidForm from '../Forms/PlaceBidForm';

export default function PlaceBidModal({ isOpen, onClose, onConfirm, minBid }) {
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
                  status: getTransactionStatus({ transactionStepNumber: 1, transactionCount }),
                  isDefaultOpen: true,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Transfer Bid Amount',
                  status: getTransactionStatus({ transactionStepNumber: 2, transactionCount }),
                  isDefaultOpen: false,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Completion',
                  status: getTransactionStatus({ transactionStepNumber: 3, transactionCount }),
                  isDefaultOpen: false,
                  description: 'Description here'
                }
              ]}
            />
          )
          : <PlaceBidForm onConfirm={data => { setFormData(data); onConfirm(data); }} />
      }
    </Modal>
  );
}
