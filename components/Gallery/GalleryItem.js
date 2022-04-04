import { useState, useContext, forwardRef } from 'react';
import Link from 'next/link'
import Web3Context from '../../contexts/Web3Context';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { HexagonBeeIcon, DiamondIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';
import ItemMain from './ItemMain';
import ItemListingState from './ItemListingState';
import fromUnixTime from 'date-fns/fromUnixTime'
import CountdownTimer from '../CountdownTimer';

const GalleryItem = forwardRef((props, ref) => {
  const { item, showRarity } = props;
  const [isHovering, setIsHovering] = useState(false);
  const { owner, name, collectionName, imageUrl, activeAuction, lastSalePrice, highestBid, highestPrice, lowestPrice, rarityRank  } = item;
  const { state: web3State } = useContext(Web3Context);
  const isOwner = owner?.toLowerCase() === web3State?.address?.toLowerCase() || false;
  const listingState = activeAuction ? NFT_LISTING_STATE.IN_AUCTION : lowestPrice !== 0 ? NFT_LISTING_STATE.FOR_SALE : NFT_LISTING_STATE.NOT_LISTED;
  const listing = activeAuction ? activeAuction : lowestPrice !== 0 ? { highestPrice, lowestPrice } : null;
  
  console.log(`item`, item)
  
  return (
    <Link href="/collections/[address]/token/[id]" as={`/collections/${item?.collectionId}/token/${item?.tokenId}`} passHref>
      <div 
        className="relative cursor-pointer w-[210px] h-[316px] text-[10px] font-normal bg-white dark:bg-gunmetal rounded-xl my-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        ref={ref}
      >
        <header className="flex items-center px-2.5 py-[9px]">
          <div className="flex items-center">
            <div className="mr-1.5">
              <HexagonBeeIcon className="w-[30px]" />
            </div>
            <div className="leading-tight">
              <h3>{ name || 'Unnamed' }</h3>
              <p className="text-silver dark:text-manatee">{ collectionName }</p>
            </div>
          </div>
          {
            showRarity && rarityRank && (
              <div className="ml-auto flex">
                <DiamondIcon className="w-[12px]" />
                <span className="text-xs ml-1.5">{ rarityRank }</span>
              </div>
            )
          }
        </header>
        <ItemMain
          isOwner={isOwner}
          isActive={isHovering}
          name={name}
          imageUrl={imageUrl}
          listingState={listingState}
          listing={listing}
        />
        <footer className="px-2.5 pt-[5px] pb-[2px]">
          <div className="flex h-[24px] justify-between border-b-[0.5px] border-silver dark:border-manatee pb-[5px] items-baseline">
            <ItemListingState 
              listingState={listingState}
              price={listingState === NFT_LISTING_STATE.IN_AUCTION ? listing?.highestBid : listing?.lowestPrice}
            />
          </div>
          <div className="flex justify-between pt-[5px] items-baseline">
            <span>{ !!lastSalePrice && <ItemPrice label="Last sale" value={lastSalePrice} /> }</span>
            <span>
              {
                listingState === NFT_LISTING_STATE.IN_AUCTION ? 
                  listing?.expiry 
                    ? <CountdownTimer date={fromUnixTime(listing?.expiry)} /> 
                    : null
                  : null
              }
              {
                listingState !== NFT_LISTING_STATE.IN_AUCTION && highestBid ? (
                  <ItemPrice label="Top offer" value={highestBid} />
                ) : null
              }
            </span>
          </div>
        </footer>
      </div>
    </Link>
  );
});

GalleryItem.displayName = 'GalleryItem';

export default GalleryItem;