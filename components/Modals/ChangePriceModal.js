import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import TransactionList from '../Transactions/TransactionList';
import Modal from './Modal';
import ChangePriceForm from '../Forms/ChangePriceForm';

const currencies = [
  { label: 'HNY', value: 'hny' }
];

export default function ChangePriceModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lower the listing price">
      {
        formData
          ? (
            <TransactionList
              steps={[
                {
                  title: 'Transaction to cancel old price',
                  status: TRANSACTION_STATUS.IN_PROGRESS,
                  isDefaultOpen: true,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Requesting signature',
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
          : <ChangePriceForm onClose={onClose} onConfirm={data => { setFormData(data); onConfirm(data); }} />
      }
    </Modal>
  );
}
