import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import MakeOfferForm from '../Forms/MakeOfferForm';
import TransactionList from '../Transactions/TransactionList';
import Modal from './Modal';

export default function MakeOfferModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make an offer">
      {
        formData
          ? (
            <TransactionList
              steps={[
                {
                  title: 'Approval to transfer',
                  status: TRANSACTION_STATUS.IN_PROGRESS,
                  isDefaultOpen: true,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Requesting Signature',
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
          : <MakeOfferForm onConfirm={data => { setFormData(data); onConfirm(data); }} />
      }
    </Modal>
  );
}
