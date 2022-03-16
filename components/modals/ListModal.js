import { useState, useEffect, useMemo } from 'react';
import { ellipseAddress } from '../../Utils';
import { getTransactionStatus } from '../../Utils/helper';
import TransactionList from '../Transactions/TransactionList';
import Image from 'next/image';
import ItemPrice from '../ItemPrice/ItemPrice';
import Modal from './Modal';
import ListingForm from '../Forms/ListingForm';

export default function ListModal({ name, imageUrl, collection, isOpen, isReset, transactionCount, onClose, onConfirm }) {
  const initialData = useMemo(() => ({
    type: null,
    currency: null,
    price: null,
    duration: null,
    auctionMethod: null
  }), []);
  const [listingData, setListingData] = useState(initialData);

  useEffect(() => {
    if (isReset) {
      setListingData(initialData);
    }
  }, [initialData, isReset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={listingData.type ? `Listing ${listingData.type === 'fixed' ? 'a Purchase' : 'an Auction' }` : 'List item for sale'}>
      {
        listingData.type 
          ? (
            <div className="max-w-lg mt-5">
              <div className="flex justify-between mb-6">
                <div className="flex items-center">
                  { 
                    imageUrl && (
                      <div className="mr-2 rounded-xl overflow-hidden h-[40px]">
                        <Image src={imageUrl} alt={name} width={40} height={40} />
                      </div>
                    )
                  }
                  <div className="leading-none">
                    <p className="text-sm text-manatee">{ ellipseAddress(collection, 4) }</p>
                    <p>{ name }</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-manatee">Price</p>
                  <ItemPrice value={listingData.price} />
                </div>
              </div>
              <div className="my-6">
                <TransactionList
                  steps={[
                    {
                      title: 'Approval to transfer',
                      status: getTransactionStatus({ transactionStepNumber: 1, transactionCount }),
                      isDefaultOpen: true,
                      description: 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.'
                    },
                    {
                      className: 'my-2',
                      title: `${listingData.type === 'auction' ? 'Transfering NFT' : 'Requesting Signature'}`,
                      status: getTransactionStatus({ transactionStepNumber: 2, transactionCount }),
                      isDefaultOpen: false,
                      description: 'Description here'
                    },
                    {
                      className: 'my-2',
                      title: 'Listing of Auction has Completed',
                      status: getTransactionStatus({ transactionStepNumber: 3, transactionCount }),
                      isDefaultOpen: false,
                      description: 'Description here'
                    }
                  ]}
                />
              </div>
            </div>
          )
          : (
            <ListingForm onSuccess={values => {
              setListingData(values);
              onConfirm({ price: values?.price, expirationDate: values?.duration });
            }} />
          )
      }
    </Modal>
  );
}
