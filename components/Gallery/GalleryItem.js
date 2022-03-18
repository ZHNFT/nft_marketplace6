import { useState, useContext } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import Web3Context from '../../contexts/Web3Context';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { HexagonBeeIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';
import ItemMain from './ItemMain';
import ItemListingState from './ItemListingState';

export default function GalleryItem({ item }) {
  const [isHovering, setIsHovering] = useState(false);
  const { owner, name, collectionName, imageUrl, activeAuction, lastSalePrice, highestBid, highestPrice, lowestPrice  } = item;
  const { state: web3State } = useContext(Web3Context);
  const isOwner = owner?.toLowerCase() === web3State?.address?.toLowerCase() || false;
  const listingState = activeAuction ? NFT_LISTING_STATE.IN_AUCTION : lowestPrice !== 0 ? NFT_LISTING_STATE.FOR_SALE : NFT_LISTING_STATE.NOT_LISTED;
  const listing = activeAuction ? activeAuction : lowestPrice !== 0 ? { highestPrice, lowestPrice } : null;

  return (
    <Link href="/collections/[address]/token/[id]" as={`/collections/${item?.collectionId}/token/${item?.tokenId}`} passHref>
      <div 
        className="relative cursor-pointer w-[210px] text-[10px] font-normal bg-white dark:bg-gunmetal rounded-xl my-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <header className="flex items-center px-2.5 py-[9px]">
          <div className="mr-1.5">
            <HexagonBeeIcon className="w-[30px]" />
          </div>
          <div className="leading-tight">
            <h3>{ name || 'Unnamed' }</h3>
            <p className="text-silver dark:text-manatee">{ collectionName }</p>
          </div>
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
            <ItemListingState listingState={listingState} />
          </div>
          <div className="flex justify-between pt-[5px] items-baseline">
            <span>{ !!lastSalePrice && <ItemPrice label="Last sale" value={lastSalePrice} /> }</span>
            <span>
              {
                // TODO: convert date to days/timer left
                listing?.expiry ? <span className="text-xs">{listing?.expiry}</span> : null
              }
              {
                listingState !== NFT_LISTING_STATE.IN_AUCTION && highestBid && (
                  <ItemPrice label="Top offer" value={highestBid} />
                )
              }
            </span>
          </div>
        </footer>
      </div>
    </Link>
  );
}