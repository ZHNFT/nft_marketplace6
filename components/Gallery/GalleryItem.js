import { useState } from 'react';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { HexagonBeeIcon } from '../icons';
import ItemMain from './ItemMain';
import ItemPrice from './ItemPrice';
import ItemListingState from './ItemListingState';

export default function GalleryItem({ item }) {
  const [isHovering, setIsHovering] = useState(false);
  const { name, collectionName, listingState, price, lastSalePrice, topOffer, auctionEndDate, imageUrl } = item;
  return (
    <div 
      className="relative w-[210px] text-[10px] font-normal bg-white dark:bg-gunmetal rounded-xl my-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <header className="flex items-center px-2.5 py-[9px]">
        <div className="mr-1.5">
          <HexagonBeeIcon className="w-[30px]" />
        </div>
        <div className="leading-tight">
          <h3>{ name }</h3>
          <p className="text-silver dark:text-manatee">{ collectionName }</p>
        </div>
      </header>
      <ItemMain isActive={isHovering} name={name} listingState={listingState} auctionEndDate={auctionEndDate} imageUrl={imageUrl} topOffer={topOffer} />
      <footer className="px-2.5 pt-[5px] pb-[2px]">
        <div className="flex h-[24px] justify-between border-b-[0.5px] border-silver dark:border-manatee pb-[5px] items-baseline">
          <ItemListingState listingState={listingState} price={price} auctionEndDate={auctionEndDate} />
        </div>
        <div className="flex justify-between pt-[5px] items-baseline">
          <span>{ lastSalePrice && <ItemPrice label="Last sale" value={lastSalePrice} /> }</span>
          <span>
            {
              // TODO: convert date to days/timer left
              auctionEndDate && <span className="text-xs">12h 32m 12s</span>
            }
            {
              listingState !== NFT_LISTING_STATE.IN_AUCTION && topOffer && (
                <ItemPrice label="Top offer" value={topOffer} />
              )
            }
          </span>
        </div>
      </footer>
    </div>
  );
}