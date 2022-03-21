import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
import { getTransactionStatus } from '../../Utils/helper';
import TransactionList from '../Transactions/TransactionList';
import BuyNowForm from '../Forms/BuyNowForm';
import Modal from './Modal';

export default function BuyNowModal({ isOpen, imageUrl, name, price, collection, onClose, onConfirm }) {
  const [formData, setFormData] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete checkout">
      {
        formData
          ? (
            <TransactionList
              steps={[
                {
                  title: `Approval to transfer ${price} HNY`,
                  status: getTransactionStatus({ transactionStepNumber: 1, transactionCount }),
                  isDefaultOpen: true,
                  description: 'Description here'
                },
                {
                  className: 'my-2',
                  title: 'Completion',
                  status: getTransactionStatus({ transactionStepNumber: 2, transactionCount }),
                  isDefaultOpen: false,
                  description: 'Description here'
                }
              ]}
            />
          )
          : (
            <BuyNowForm
              imageUrl={imageUrl}
              name={name}
              price={price}
              collection={collection}
              onConfirm={data => { setFormData(data); onConfirm(); }}
            />
          )
      }
    </Modal>
  );
}
