import { useRouter } from 'next/router';
import { NFT_LISTING_STATE } from '../../constants/nft';
import Gallery from '../Gallery/Gallery';
import Activity from './Activity';

// test data
const nftItems = [
  { id: 622, name: 'Bee #622', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.FOR_SALE, price: 43, lastSalePrice: 38, topOffer: 23, auctionEndDate: null, imageUrl: '/test/gallery/1.png' },
  { id: 623, name: 'Bee #623', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.IN_AUCTION, price: 50, lastSalePrice: 20, topOffer: null, auctionEndDate: '2022-03-19T00:13:11.110680Z', imageUrl: '/test/gallery/2.png' },
  { id: 624, name: 'Bee #624', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.NOT_LISTED, price: null, lastSalePrice: 38, topOffer: null, auctionEndDate: null, imageUrl: '/test/gallery/3.png' },
  { id: 625, name: 'Bee #625', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.FOR_SALE, price: 43, lastSalePrice: 38, topOffer: 23, auctionEndDate: null, imageUrl: '/test/gallery/4.png' },
  { id: 626, name: 'Bee #626', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.IN_AUCTION, price: 50, lastSalePrice: 20, topOffer: null, auctionEndDate: '2022-03-19T00:13:11.110680Z', imageUrl: '/test/gallery/5.png' },
  { id: 627, name: 'Bee #627', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.NOT_LISTED, price: null, lastSalePrice: 38, topOffer: null, auctionEndDate: null, imageUrl: '/test/gallery/6.png' },
  { id: 628, name: 'Bee #628', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.FOR_SALE, price: 43, lastSalePrice: 38, topOffer: 23, auctionEndDate: null, imageUrl: '/test/gallery/7.png' },
  { id: 629, name: 'Bee #629', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.IN_AUCTION, price: 50, lastSalePrice: 20, topOffer: null, auctionEndDate: '2022-03-19T00:13:11.110680Z', imageUrl: '/test/gallery/8.png' },
  { id: 630, name: 'Bee #630', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.NOT_LISTED, price: null, lastSalePrice: 38, topOffer: null, auctionEndDate: null, imageUrl: '/test/gallery/9.png' },
  { id: 631, name: 'Bee #631', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.FOR_SALE, price: 43, lastSalePrice: 38, topOffer: 23, auctionEndDate: null, imageUrl: '/test/gallery/10.png' },
  { id: 632, name: 'Bee #632', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.IN_AUCTION, price: 50, lastSalePrice: 20, topOffer: null, auctionEndDate: '2022-03-19T00:13:11.110680Z', imageUrl: '/test/gallery/11.png' },
  { id: 633, name: 'Bee #633', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.NOT_LISTED, price: null, lastSalePrice: 38, topOffer: null, auctionEndDate: null, imageUrl: '/test/gallery/12.png' },
  { id: 634, name: 'Bee #634', collectionName: 'Hive Investments', listingState: NFT_LISTING_STATE.NOT_LISTED, price: null, lastSalePrice: 38, topOffer: null, auctionEndDate: null, imageUrl: '/test/gallery/13.png' }
];

export default function ProfileContent() {
  const { query: { tab } } = useRouter();
  
  if (tab === 'activity') {
    return <Activity />;
  }

  if (tab === 'offers') {
    return <div>Offers content here</div>;
  }

  // default content
  return <Gallery items={nftItems} />;
}
