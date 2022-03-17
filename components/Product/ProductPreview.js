
import Image from 'next/image';
import { fromUnixTime, format } from 'date-fns';
import { resolveBunnyLink } from '../../Utils';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { ViewIcon, AuctionIcon } from '../icons';
import NotFoundImage from '../../images/No-Image-Placeholder.png';

const LISTING_LABELS = {
  [NFT_LISTING_STATE.IN_AUCTION]: 'Auction',
  [NFT_LISTING_STATE.FOR_SALE]: 'For sale'
};

export default function ProductPreview({ className, name, image, expiry, listingState }) {
  const dateFormat = `EEEE do LLLL 'at' k:m`;

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex text-xxs">
          <span className="rounded-xl dark:bg-white/[0.05] bg-black/[0.05] py-1 px-3">Utility</span>
          <span className="flex ml-2 rounded-xl dark:bg-white/[0.05] bg-black/[0.05] py-1 px-2.5">
            <ViewIcon className="w-[16px]" />
            <span className="ml-1">9K</span>
          </span>
        </div>
        {
          expiry && (
            <div className="text-xs text-manatee">
              { listingState === NFT_LISTING_STATE.IN_AUCTION && <AuctionIcon className="w-[14px] mr-2 relative -top-[1px]" /> }
              { `Ends ${format(fromUnixTime(expiry), dateFormat)} UTC` }
            </div>
          )
        } 
      </div>
      <div className="relative">
        {
          LISTING_LABELS[listingState] && (
            <div
              className="absolute right-[10px] top-[10px] z-10 text-xs text-cornflower font-medium rounded-xl py-1 px-2 backdrop-blur-md"
              style={{ background: 'rgba(32, 34, 37, 0.5)'}}
            >
              { LISTING_LABELS[listingState] }
            </div>
          )
        }
        <div className="aspect-w-4 aspect-h-4 rounded-lg bg-gray-100 overflow-hidden">
          {image ? (
            <Image
            src={`${resolveBunnyLink(image)}?optimizer=image&width=600&height=600`}
            alt={name}
            className="object-center object-cover"
            layout="fill" 
          /> 
          ) : (
            <Image
              src={NotFoundImage}
              alt={name}
              className="object-center object-cover"
              layout="fill" 
            /> 
          )}
        </div>
      </div>
    </div>
  );
}