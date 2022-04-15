import { Fragment, useContext } from 'react';
import { Transition } from '@headlessui/react';
import Image from 'next/image';
import { resolveBunnyLink } from '../../Utils';
import { NFT_LISTING_STATE, NFT_MODALS } from '../../constants/nft';
import { PulseIcon } from '../icons';
import PrimaryButton from '../Buttons/PrimaryButton';
import SecondaryButton from '../Buttons/SecondaryButton';
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import ItemPrice from '../ItemPrice/ItemPrice';
import DefaultImage from '../../images/No-Image-Placeholder.png';
import CountdownTimer from '../CountdownTimer';
import fromUnixTime from 'date-fns/fromUnixTime'
import AppGlobalContext from "../../contexts/AppGlobalContext";

export default function ItemMain({ isOwner, isActive, name, listingState, imageUrl, imageHostedUrl, listing, tokenId, collectionId }) {
  const { handleModal, setNftData } = useContext(AppGlobalContext);
  //const imageOptimizer = imageUrl?.split('.').pop() === 'gif' ? 'gif' : 'image';
  const imageOptimizer = 'image';

  function setNft() {
    setNftData({
      tokenId: tokenId,
      collectionId: collectionId
    })
  }
  return (
    <div className="relative rounded-xl overflow-hidden aspect-w-1 aspect-h-1 w-[170px] md:w-[210px]">
      <Image
        className="block w-full object-center object-cover"
        src={imageHostedUrl ? `${resolveBunnyLink(imageHostedUrl)}?optimizer=${imageOptimizer}&width=420&aspect_ratio=1:1` : DefaultImage}
        alt={name}
        layout="fill" 
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
                  listingState !== NFT_LISTING_STATE.IN_AUCTION && !isOwner && (
                    <div className="w-full mx-[14px] flex justify-center">
                      {
                        listingState === NFT_LISTING_STATE.FOR_SALE && (
                          <PrimaryButton
                            className="w-[85px] h-[30px] mr-[6px]"
                            size="sm"
                            onClick={(event) => {
                              event.preventDefault();
                              setNft();
                              handleModal(NFT_MODALS.BUY_NOW)
                            }}
                          >
                            Buy now
                          </PrimaryButton>
                        )
                      }
                      <div className="relative flex flex-col ml-[6px]">
                        <SecondaryButton
                          className="h-[30px]"
                          size="xs"
                          onClick={(event) => {
                            event.preventDefault();
                            setNft();
                            handleModal(NFT_MODALS.MAKE_OFFER)
                          }}
                        >
                          Make offer
                        </SecondaryButton>
                        {
                          listing?.highestPrice && (
                            <span className="text-center absolute left-0 right-0 -bottom-[28px]">
                              <ItemPrice label="Highest" value={listing?.highestPrice} />
                            </span>
                          )
                        }
                      </div>
                    </div>
                  )
                }
                {
                  listingState === NFT_LISTING_STATE.IN_AUCTION && !isOwner && (
                    <>
                      <div className="absolute top-[10px] left-[5px]">
                        <ProgressCircle width="210" height="210" percent="80" />
                      </div>
                      <div className="relative flex flex-col">
                        <SecondaryButton
                          className="w-[85px]"
                          size="xs"
                          onClick={(event) => {
                            event.preventDefault();
                            setNft();
                            handleModal(NFT_MODALS.PLACE_BID)
                          }}
                        >
                          Place Bid
                        </SecondaryButton>
                        <span className="text-center absolute left-0 right-0 -bottom-[21px] text-white">
                          {listing?.expiry 
                            ? <CountdownTimer date={fromUnixTime(listing?.expiry)} /> 
                            : null
                          }
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