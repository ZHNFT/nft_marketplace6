import { NFT_LISTING_STATE } from '../constants/nft';
import { ellipseAddress } from '.';

const formatCurrency = ({ value }) => (
  '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
);

// use like this: formatter.format(value);
const formatter = new Intl.NumberFormat('en-US', {
  // style: 'currency',
  // currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 2 // (causes 2500.99 to be printed as $2,501)
});

const getListingData = (item) => {
  // hardcoded values for testing
  return {
    listingState: NFT_LISTING_STATE.NOT_LISTED,
    price: 0,
    lastSalePrice: 2,
    topOffer: null
  };
};

const transformGalleryItems = (items) => (
  items.map(item => {
    const { name, collectionId, image, tokenId, owner } = item;
    const  { listingState, price, lastSalePrice, topOffer } = getListingData(item);
    
    return {
      name,
      collectionName: ellipseAddress(collectionId, 4),
      tokenId,
      collectionId,
      imageUrl: image,
      auctionEndDate: null,
      listingState,
      price,
      lastSalePrice,
      topOffer,
      owner
    };
  })
);

const convertToUsd = ({ value }) => (
  // hardcoded rate for testing
  formatter.format(value * 1.5)
)

export {
  formatCurrency,
  formatter,
  transformGalleryItems,
  convertToUsd
};