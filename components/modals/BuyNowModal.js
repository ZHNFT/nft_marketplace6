import { useState } from 'react';
import { TRANSACTION_STATUS } from '../../constants/nft';
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
          )
          : (
            <BuyNowForm
              imageUrl={imageUrl}
              name={name}
              price={price}
              collection={collection}
              onConfirm={setFormData}
            />
          )
      }
    </Modal>
  );
}
