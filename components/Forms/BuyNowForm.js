import { useState } from 'react';
import Image from 'next/image';
import { ellipseAddress } from '../../Utils';
import { usdFormatter, formatEther } from '../../Utils/helper';
import PrimaryButton from '../Buttons/PrimaryButton';
import TransactionList from '../Transactions/TransactionList';
import { BeeIcon } from '../icons';
import useAcceptListing from '../../hooks/useAcceptListing';

export default function BuyNowForm(props) {
  const { imageUrl, name, collectionId, marketplaceContract, activeListing, fetchData, tokenPriceUsd, tokenContract, marketplaceAddress, address } = props;
  const [isConfirming, setIsConfirming] = useState(false);
  const { handleAcceptListing, acceptationTx: transaction, acceptationStatus, acceptationError, allowanceStatus, allowanceError } = useAcceptListing({ marketplaceContract, setIsConfirming, tokenContract, marketplaceAddress, address });
  const price = activeListing?.pricePerItem;

  async function handleConfirm() {
    setIsConfirming(true);
    await handleAcceptListing(activeListing);
    fetchData();
  }

  const hasError = allowanceError || acceptationError;

  if (isConfirming || hasError) {
    return (
      <TransactionList
        steps={[
          {
            title: `Increase Allowance`,
            status: allowanceStatus,
            isDefaultOpen: true,
            description: allowanceError ? allowanceError : 'Description here'
          },
          {
            title: `Approval to transfer ${price} HNY`,
            status: acceptationStatus,
            isDefaultOpen: true,
            description: acceptationError ? acceptationError : 'Description here'
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
              <BeeIcon className="h-[14px] -top-[2px] relative pr-[5px]" />
              <span>{price ? formatEther(price) : price}</span>
            </div>
            <p className="text-manatee text-sm">{usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd))}</p>
          </div>
        </div>
      </div>

      <div className="border-t-[0.5px] border-t-manatee pt-4">
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Total</p>
          <div className="text-right">
            <div>
              <BeeIcon className="h-[16px] -top-[3px] relative pr-[5px]" />
              <span className="font-medium text-xl text-cornflower">{price ? formatEther(price) : price}</span>
            </div>
            <p className="text-manatee text-sm">{usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd))}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={handleConfirm}>Confirm Checkout</PrimaryButton>
      </div>
    </>
  );
}
