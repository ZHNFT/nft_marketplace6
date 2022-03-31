import { NFT_LISTING_STATE } from '../../constants/nft';
import { AuctionIcon, CartIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';

export default function ItemListingState({ listingState, price }) {
  if (listingState === NFT_LISTING_STATE.NOT_LISTED) {
    return <span className="text-silver dark:text-manatee ml-auto">Not listed</span>
  }

  if (listingState === NFT_LISTING_STATE.IN_AUCTION) {
    return (
      <>
        <span><ItemPrice label="Current bid" value={price} /></span>
        <span>
          <AuctionIcon className="w-[12px] -top-[1px] relative mr-1" />
          <span className="text-silver dark:text-manatee">Auction</span>
        </span>
      </>
    );
  }

  return (
    <>
      <span><ItemPrice label="Price" value={price} /></span>
      <span>
        <CartIcon className="w-[12px] relative -top-[2px] mr-1" />
        <span className="text-silver dark:text-manatee">For sale</span>
      </span>
    </>
  );
}