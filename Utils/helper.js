import { ethers } from "ethers";
import { NFT_LISTING_STATE, TRANSACTION_STATUS } from '../constants/nft';
import { ellipseAddress } from '.';
import _ from "lodash";

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

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// https://docs.ethers.io/v5/api/utils/display-logic/
// https://docs.ethers.io/v5/api/utils/bignumber/
const formatEther = (value) => {
  if (!value) return;
  const valueString = typeof value === 'string' ? ethers.BigNumber.from(value) : ethers.BigNumber.from(value?.toString());
  return ethers.utils.formatEther(valueString);
}

const transformGalleryItem = (item) => {
    // highestPrice/lowestPrice is only for listings
    const { name, collectionId, imageHosted, tokenId, owner, lastSalePrice, highestBid, highestPrice, lowestBid, lowestPrice, rarityRank } = item;
    // there can only be one active auction or listing for a token at the same time
    const activeAuction = item?.auctions?.find(auction => auction?.active);
    return {
      name,
      collectionName: ellipseAddress(collectionId, 4),
      tokenId,
      collectionId,
      imageUrl: imageHosted,
      owner,
      activeAuction,
      lastSalePrice,
      highestBid,
      highestPrice,
      lowestBid,
      lowestPrice,
      rarityRank,
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

const toFixedOptional = ({ value, decimals }) => +parseFloat(value).toFixed(decimals);

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getListingState = ({ listings, auctions }) => {
  const activeAuction = auctions?.find(auction => auction?.active);
  if (activeAuction) {
    return { state: NFT_LISTING_STATE.IN_AUCTION, expiry: activeAuction.expiry };
  }

  const activeListing = listings?.find(listing => listing?.active);
  if (activeListing) {
    return { state: NFT_LISTING_STATE.FOR_SALE, expiry: activeListing.expiry };
  }

  return { state: NFT_LISTING_STATE.NOT_LISTED, expiry: null };
}

async function getUserDetails(address) {
  if (address) {
    try {
      const response = await fetch(`https://hexagon-api.onrender.com/users/${address}`);
      if (!response.status == 200) {
        return {}
      }

      return response.json();
    } catch (err) {
      console.log(err);
    }
  }
}

const transformUserData = (user) => {
  if (!user) {
    return {
      username: '',
      description: '',
      website: '',
      twitter: '',
      instagram: '',
      imageUrl: ''
    }
  }

  const website = _.find(user.socials, { name: "website" })?.href;
  const twitter = _.find(user.socials, { name: "twitter" })?.href;
  const instagram = _.find(user.socials, { name: "instagram" })?.href;
  const username = user.username;
  const description = user.description;
  const imageUrl = user.imageUrl;

  return {
    username,
    description,
    website,
    twitter,
    instagram,
    imageUrl
  }
}

export {
  formatCurrency,
  formatter,
  transformGalleryItem,
  convertToUsd,
  getTransactionStatus,
  toFixedOptional,
  fetcher,
  getListingState,
  getUserDetails,
  transformUserData,
  usdFormatter,
  formatEther
};