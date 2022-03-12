import Image from 'next/image';
import { ellipseAddress } from '../../Utils';
import { convertToUsd } from '../../Utils/helper';
import Modal from './Modal';
import PrimaryButton from '../Buttons/PrimaryButton';
import { BeeIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';

export default function BuyNowModal({ isOpen, imageUrl, name, price, collection, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete checkout">
      <div className="mt-4 mb-8">
        <div className="flex justify-between mb-6 border-[0.5px] border-b-manatee pb-2">
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
              <a href="#" className="text-sm text-cornfllower">{ ellipseAddress(collection, 4) }</a>
              <p className="leading-2 mb-1">{ name }</p>
              <p className="text-[11px] text-manatee">Creator Fees: 2.5%</p>
            </div>
          </div>
          <div className="text-right">
            <div>
              <BeeIcon className="w-[25px] -top-[3px] relative" />
              <span>{ price }</span>
            </div>
            <p className="text-manatee text-sm">${ convertToUsd({ value: price }) }</p>
          </div>
        </div>
      </div>

      <div className="border-[0.5px] border-t-manatee pt-4">
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Total</p>
          <div className="text-right">
            <div>
              <BeeIcon className="w-[28px] -top-[4px] relative" />
              <span className="font-medium text-xl text-cornflower">{ price }</span>
            </div>
            <p className="text-manatee text-sm">${ convertToUsd({ value: price }) }</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={onConfirm}>Confirm Checkout</PrimaryButton>
      </div>
    </Modal>
  );
}
