import { useState } from 'react';
import Modal from './Modal';
import ListingForm from '../Forms/ListingForm';
import CompleteListing from '../Transactions/CompleteListing';

export default function ListModal({ name, imageUrl, collection, isOpen, onClose }) {
  const initialData = {
    type: null,
    currency: null,
    price: null,
    duration: null,
    auctionMethod: null
  };
  const [listingData, setListingData] = useState(initialData);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={listingData.type ? `Listing ${listingData.type === 'fixed' ? 'a Purchase' : 'an Auction' }` : 'List item for sale'}>
      {
        listingData.type 
          ? (
            <CompleteListing
             {...listingData}
             name={name}
             imageUrl={imageUrl}
             collection={collection}
             onCancel={() => setListingData(initialData)} // reset on cancel
            />
          )
          : <ListingForm onSuccess={values => setListingData(values)} />
      }
    </Modal>
  );
}
