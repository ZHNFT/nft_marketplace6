import Image from 'next/image';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, CheckIcon } from '@heroicons/react/outline';
import { ellipseAddress } from '../../Utils';
import ItemPrice from '../ItemPrice/ItemPrice';
import PrimaryButton from '../Buttons/PrimaryButton';

export default function CompleteListing(props) {
  const { name, imageUrl, collection, price, currency, onCancel } = props;
  return (
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
            <ItemPrice value={price} />
          </div>
        </div>
        <div className="my-6">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left border-[0.5px] border-manatee rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckIcon className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-lg ml-2">
                      Initialize your wallet
                    </span>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? '' : 'transform rotate-180'
                    } w-5 h-5 text-manatee`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  To get set up for selling on Hexagon for the first time, you must initialize your wallet, which requires a one-time gas fee.
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure defaultOpen as="div" className="my-2">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left border-[0.5px] border-manatee rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border-[0.5px] border-ink dark:border-white flex items-center justify-center">
                      2
                    </div>
                    <span className="text-lg ml-2">
                      Approve this item for sale
                    </span>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? '' : 'transform rotate-180'
                    } w-5 h-5 text-manatee`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure as="div" className="my-2">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left border-[0.5px] border-manatee rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border-[0.5px] border-ink dark:border-white flex items-center justify-center">
                      3
                    </div>
                    <span className="text-lg ml-2">
                    Confirm { price } { currency?.toUpperCase() } listing
                    </span>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? '' : 'transform rotate-180'
                    } w-5 h-5 text-manatee`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                  Accept the signature request in your wallet and wait for your listing to process
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="mt-9 flex justify-center">
          <PrimaryButton
            className="max-w-[300px]"
            onClick={onCancel}
          >
            Cancel listing
          </PrimaryButton>
        </div>
    </div>
  );
}