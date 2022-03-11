import { useState } from 'react';
import Modal from '../modals/Modal';
import Listing from '../Listing/Listing';
import CompleteListing from '../Listing/CompleteListing';

export default function ListModal({ name, imageUrl, collection, isOpen, onClose }) {
  const initialData = {
    type: null,
    currency: null,
    price: null,
    duration: null,
    auctionMethod: null
  };
  const [isListingStarted, setIsListingStarted] = useState(initialData);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isListingStarted.type ? 'Complete your listing' : 'List item for sale'}>
      {
        isListingStarted.type 
          ? (
            <CompleteListing
             {...isListingStarted}
             name={name}
             imageUrl={imageUrl}
             collection={collection}
             onCancel={() => setIsListingStarted(initialData)} // reset on cancel
            />
          )
          : <Listing onSuccess={values => setIsListingStarted(values)} />
      }
    </Modal>
  );
}
