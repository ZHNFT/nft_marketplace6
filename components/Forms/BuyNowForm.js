import { useState } from 'react';
import Image from 'next/image';
import { ellipseAddress } from '../../Utils';
import { convertToUsd } from '../../Utils/helper';
import PrimaryButton from '../Buttons/PrimaryButton';
import TransactionList from '../Transactions/TransactionList';
import { BeeIcon } from '../icons';
import { TRANSACTION_STATUS, NFT_MODALS } from '../../constants/nft';

export default function BuyNowForm(props) {
  const { imageUrl, name, collectionId, marketplaceContract, activeListing } = props;
  const [isConfirming, setIsConfirming] = useState(false);
  const { handleAcceptListing, acceptationTx: transaction, acceptationStatus, acceptationError } = useAcceptListing({ marketplaceContract, setIsConfirming });
  const price = activeListing?.pricePerItem;

  function handleConfirm() {
    setIsConfirming(true);
    handleAcceptListing(activeListing);
  }

  if (isConfirming) {
    return (
      <TransactionList
        steps={[
          {
            title: `Approval to transfer ${price} HNY`,
            status: acceptationStatus,
            isDefaultOpen: true,
            description: 'Description here'
          }
        ]}
      />
    )
  }

  return (
    <>
      <div className="mt-4 mb-8">
        <div className="flex justify-between mb-6 border-b-[0.5px] border-b-manatee pb-2">
          <span className="font-medium">Item</span>
          <span className="font-medium">Subtotal</span>
        </div>
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            {
              imageUrl && (
                <div className="mr-2 rounded-xl overflow-hidden h-[60px]">
                  <Image src={imageUrl} alt={name} width={60} height={60} />
                </div>
              )
            }
            <div className="leading-none">
              <a href="#" className="text-sm text-cornfllower">{ellipseAddress(collectionId, 4)}</a>
              <p className="leading-2 mb-1">{name}</p>
              <p className="text-[11px] text-manatee">Creator Fees: 2.5%</p>
            </div>
          </div>
          <div className="text-right">
            <div>
              <BeeIcon className="w-[25px] -top-[3px] relative" />
              <span>{price}</span>
            </div>
            <p className="text-manatee text-sm">${convertToUsd({ value: price })}</p>
          </div>
        </div>
      </div>

      <div className="border-t-[0.5px] border-t-manatee pt-4">
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Total</p>
          <div className="text-right">
            <div>
              <BeeIcon className="w-[28px] -top-[4px] relative" />
              <span className="font-medium text-xl text-cornflower">{price}</span>
            </div>
            <p className="text-manatee text-sm">${convertToUsd({ value: price })}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={handleConfirm}>Confirm Checkout</PrimaryButton>
      </div>
    </>
  );
}
