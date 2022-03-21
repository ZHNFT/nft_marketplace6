import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import { getTransactionStatus } from '../../Utils/helper';
import MakeOfferForm from '../Forms/MakeOfferForm';
import TransactionList from '../Transactions/TransactionList';
import Modal from './Modal';

export default function MakeOfferModal({ isOpen, onClose, onConfirm, transactionCount }) {
  const [formData, setFormData] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make an offer">
      {
        formData
          ? (
            <TransactionList
              steps={[
                {
                  title: 'Increase Allowance',
                  status: getTransactionStatus({ transactionStepNumber: 1, transactionCount }),
                  isDefaultOpen: true,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Requesting Signature',
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
          : <MakeOfferForm onConfirm={data => { setFormData(data); onConfirm(data); }} />
      }
    </Modal>
  );
}
