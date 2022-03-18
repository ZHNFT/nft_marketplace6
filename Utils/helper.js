import { NFT_LISTING_STATE, TRANSACTION_STATUS } from '../constants/nft';
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

const transformGalleryItem = (item) => {
    console.log(`item`, item)
    // highestPrice/lowestPrice is only for listings
    const { name, collectionId, image, tokenId, owner, lastSalePrice, highestBid, highestPrice, lowestBid, lowestPrice } = item;
    // there can only be one active auction or listing for a token at the same time
    const activeAuction = item?.auctions?.find(auction => auction?.active);
    return {
      name,
      collectionName: ellipseAddress(collectionId, 4),
      tokenId,
      collectionId,
      imageUrl: image,
      owner,
      activeAuction,
      lastSalePrice,
      highestBid,
      highestPrice,
      lowestBid,
      lowestPrice
    };
  };

const convertToUsd = ({ value }) => (
  // hardcoded rate for testing
  formatter.format(value * 1.5)
)

const getTransactionStatus = ({ transactionStepNumber, transactionCount }) => {
  if (transactionCount === null) {
    return TRANSACTION_STATUS.SUCCESS;
  }

  const diff = transactionStepNumber - transactionCount;

  if (diff === 1) {
    return TRANSACTION_STATUS.IN_PROGRESS;
  }

  if (diff > 1) {
    return TRANSACTION_STATUS.INACTIVE;
  }

  return TRANSACTION_STATUS.SUCCESS;
};

export {
  formatCurrency,
  formatter,
  transformGalleryItem,
  convertToUsd,
  getTransactionStatus
};