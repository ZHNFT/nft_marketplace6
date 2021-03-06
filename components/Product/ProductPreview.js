
import Image from 'next/image';
import { fromUnixTime, format } from 'date-fns';
import { resolveBunnyLink } from '../../Utils';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { LISTING_END_DATE_FORMAT } from '../../constants/dates';
import { ViewIcon, AuctionIcon } from '../icons';
import NotFoundImage from '../../images/No-Image-Placeholder.png';
import Spinner from '../Spinner/Spinner';

const LISTING_LABELS = {
  [NFT_LISTING_STATE.IN_AUCTION]: 'Auction',
  [NFT_LISTING_STATE.FOR_SALE]: 'For sale'
};

export default function ProductPreview({ className, name, image, imageHosted, expiry, listingState, collectionCategories }) {
  const { imageOptimizer, imageWidth } = image?.split('.').pop() === 'gif'
    ? { imageOptimizer: 'gif', imageWidth: 472 }
    : { imageOptimizer: 'image', imageWidth: 944 };
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex text-xxs">
          {
            collectionCategories?.map((category, index) => (
              <span key={`collection_category_${index}`} className="first:ml-0 ml-2 rounded-xl inline-block rounded-xl dark:bg-white/[0.05] bg-black/[0.05] py-1 px-3 capitalize">{ category }</span>
            ))
          }
        </div>
        {
          expiry && (
            <div className="text-xs text-manatee mt-2 sm:mt-auto">
              { listingState === NFT_LISTING_STATE.IN_AUCTION && <AuctionIcon className="w-[14px] mr-2 relative -top-[1px]" /> }
              { `Ends ${format(fromUnixTime(expiry), LISTING_END_DATE_FORMAT)} UTC` }
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
        <div className="aspect-w-4 aspect-h-4 rounded-xl overflow-hidden relative">
          <>
            <Spinner className="w-[26px] dark:text-white text-ink m-auto" />
            {image ? (
              <Image
              src={`${resolveBunnyLink(imageHosted)}?optimizer=${imageOptimizer}&width=${imageWidth}&aspect_ratio=1:1`}
              alt={name}
              className="object-center object-contain"
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
          </>
        </div>
      </div>
    </div>
  );
}