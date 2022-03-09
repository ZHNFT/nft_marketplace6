import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Image from 'next/image';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { PulseIcon } from '../icons';
import PrimaryButton from '../Buttons/PrimaryButton';
import SecondaryButton from '../Buttons/SecondaryButton';
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import ItemPrice from '../ItemPrice/ItemPrice';

export default function ItemMain({ isActive, name, listingState, auctionEndDate, topOffer, imageUrl }) {
  return (
    <div className="relative rounded-xl overflow-hidden w-[210px] h-[210px]">
      <Image
        className="block w-full"
        src={imageUrl}
        alt={name}
        width="210"
        height="210"
      />
      {
        <Transition
          show={isActive}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="flex items-center justify-center rounded-xl absolute top-0 left-0 w-full h-full bg-black/[0.3] backdrop-blur-sm">
            { 
              <>
                <div className="flex justify-center items-center absolute h-[23px] w-[23px] top-[12px] right-[13px] rounded-full bg-white/[0.1]">
                  <PulseIcon className="w-[15px] text-white" />
                </div>
                {
                  listingState !== NFT_LISTING_STATE.IN_AUCTION && (
                    <div className="w-full mx-[14px] flex justify-center">
                      {
                        listingState === NFT_LISTING_STATE.FOR_SALE && (
                          <PrimaryButton className="w-[85px] h-[30px]" onClick={() => console.log('buy now')}>Buy now</PrimaryButton>
                        )
                      }
                      <div className="relative flex flex-col ml-[6px]">
                        <SecondaryButton className="w-[85px] h-[30px]" onClick={() => console.log('make offer')}>Make offer</SecondaryButton>
                        {
                          topOffer && (
                            <span className="text-center absolute left-0 right-0 -bottom-[28px]">
                              <ItemPrice label="Highest" value={topOffer} />
                            </span>
                          )
                        }
                      </div>
                    </div>
                  )
                }
                {
                  listingState === NFT_LISTING_STATE.IN_AUCTION && (
                    <>
                      <div className="absolute top-[10px] left-[5px]">
                        <ProgressCircle width="210" height="210" percent="80" />
                      </div>
                      <div className="relative flex flex-col">
                        <SecondaryButton className="w-[85px]" onClick={() => console.log('place bid')}>Place Bid</SecondaryButton>
                        <span className="text-center absolute left-0 right-0 -bottom-[21px]">
                          { /* TODO: time left */ }
                          12h 32m 12s
                        </span>
                      </div>
                    </>
                  )
                }
              </>
            }
          </div>
        </Transition>
      }
    </div>
  );
}