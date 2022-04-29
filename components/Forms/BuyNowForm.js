import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ellipseAddress } from '../../Utils';
import { usdFormatter, formatEther } from '../../Utils/helper';
import PrimaryButton from '../Buttons/PrimaryButton';
import TransactionList from '../Transactions/TransactionList';
import CurrencyIcon from '../CurrencyIcon/CurrencyIcon';
import useAcceptListing from '../../hooks/useAcceptListing';

export default function BuyNowForm(props) {
  const { isRefetching, imageUrl, name, collectionId, marketplaceContract, currencySymbol, activeListing, tokenPriceUsd, tokenContract, marketplaceAddress, address, setShouldRefetch } = props;
  const [isConfirming, setIsConfirming] = useState(false);
  const { handleAcceptListing, acceptationTx: transaction, acceptationStatus, acceptationError, allowanceStatus, allowanceError } = useAcceptListing({ marketplaceContract, tokenContract, marketplaceAddress, address });
  const price = activeListing?.pricePerItem;

  const hasError = allowanceError || acceptationError;

  async function handleConfirm() {
    setIsConfirming(true);
    await handleAcceptListing(activeListing);
    if (!hasError) {
      setShouldRefetch(true)
    }
  }

  const [fees, setFees] = useState({ "marketplaceFee": "0", "royaltyFee": "0" });

  const fetchFees = useCallback(async function () {
    let collection = await marketplaceContract.getCollectionInfo(collectionId);
    let royaltyFee = collection.royaltyFee;
    let marketplaceFee;

    if (royaltyFee != 0) {
      royaltyFee = royaltyFee.toString();
      royaltyFee = ((parseFloat(royaltyFee) * 99) / 10000).toFixed(1);
    } else {
      royaltyFee = "0"
    }

    if ("paymentTokens" in marketplaceContract) {
      let token = await marketplaceContract.paymentTokens(collection.currencyType)
      marketplaceFee = token.fee;
    } else {
      marketplaceFee = 0;
    }

    if (marketplaceFee != 0) {
      marketplaceFee = marketplaceFee.toString();
      marketplaceFee = ((parseFloat(marketplaceFee) * 100) / 10000).toFixed(1)
    } else {
      marketplaceFee = "0";
    }

    let data = { "marketplaceFee": marketplaceFee, "royaltyFee": royaltyFee }

    setFees(data);

  }, [marketplaceContract, collectionId]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees])

  if (isConfirming || hasError || isRefetching) {
    return (
      <TransactionList
        steps={[
          {
            title: `Increase Allowance`,
            status: allowanceStatus,
            isDefaultOpen: true,
            description: allowanceError ? allowanceError : ''
          },
          {
            title: `Approval to transfer ${formatEther(price)} ${currencySymbol}`,
            status: acceptationStatus,
            isDefaultOpen: true,
            description: acceptationError ? acceptationError : ''
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
              <p className="text-[11px] text-manatee">{"Creator Fees: " + fees.royaltyFee + "%"}</p>
            </div>
          </div>
          <div className="text-right">
            <div>
              <CurrencyIcon currency={currencySymbol} hnyClassName="h-[14px] -top-[2px] -mr-1 relative pr-[5px]" ethWidth={9} ethHeight={13} />
              <span className="ml-1">{price ? formatEther(price) : "0"}</span>
            </div>
            <p className="text-manatee text-sm">{price && tokenPriceUsd ? usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd)) : null}</p>
          </div>
        </div>
      </div>

      <div className="border-t-[0.5px] border-t-manatee pt-4">
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Total</p>
          <div className="text-right">
            <div>
              <CurrencyIcon currency={currencySymbol} hnyClassName="h-[16px] -mr-1 -top-[3px] relative pr-[5px]" />
              <span className="font-medium text-xl text-cornflower ml-1">{price ? formatEther(price) : "0"}</span>
            </div>
            <p className="text-manatee text-sm">{price && tokenPriceUsd ? usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd)) : null}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={handleConfirm}>Confirm Checkout</PrimaryButton>
      </div>
    </>
  );
}
