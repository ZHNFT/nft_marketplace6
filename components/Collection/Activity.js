import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { usdFormatter, formatEther } from '../../Utils/helper';
import { ellipseAddress } from '../../Utils';
import { Table, RowHeading, Row, Cell } from '../Table';
import { CartIcon, LinkIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';
import Tooltip from '../Tooltip/Tooltip';

const testActivities = [
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/1.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#1' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/2.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#2' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/3.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#3' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/4.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#4' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/5.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#5' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/6.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#6' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/7.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#7' },
  { type: 'List', description: 'For sale', name: 'Bee #622', collection: 'Hive Investments', imageUrl: '/test/gallery/8.png', price: 16700, priceUsd: 167000, from: 'Bob Geldof', to: null, date: '2021-03-19T00:13:11.110680Z', url: '#', transactionId: '#8' }
];

export default function Activity({ tokenPriceUsd }) {
  const router = useRouter();
  const { address } = router.query;
  const [activities, setActivities] = useState([]);

  const fetchData = useCallback(async function() {
    const url = `https://hexagon-api.onrender.com/collections/${address}/activity?include=sales&include=listings&include=bids&include=transfers`;
    const res = await fetch(url)
    const data = await res?.json()
    setActivities(data);
  }, [address])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  console.log(`activities`, activities)

  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[30px]" />
        <Cell className="w-[100px]">Type</Cell>
        {/* <Cell className="w-[200px]">Item</Cell> */}
        <Cell className="w-[100px] text-center">Price</Cell>
        <Cell className="w-[100px] text-center">From</Cell>
        <Cell className="w-[100px] text-center">To</Cell>
        <Cell className="w-[100px] text-center">
          <button type="button">
            Date
            <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-manatee mb-[1px] ml-1"></span>
          </button>
        </Cell>
        <Cell className="w-[50px]" />
      </RowHeading>
      {
        activities?.results?.map(row => {
          const { activityType, fromAddress, toAddress, minBid, _id, expiry, pricePerItem, seller, buyer, value, blockNumber, blockTimestamp, transactionHash, userAddress } = row;
          const price = activityType === 'sale' ? value : activityType === 'bid' || activityType === 'listing' ?  pricePerItem : minBid;
          const from = activityType === 'bid' ? userAddress : activityType === 'sale' ? seller : fromAddress;
          const to = activityType === 'sale' ? buyer : toAddress;
          // TODO FIX DATE with correct formatting
          const date = ''
          return (
            <Row key={_id} className="cursor-pointer" onClick={() => router.push('#')}>
              <Cell className="w-[30px]">
                <CartIcon className="w-[16px]" />
              </Cell>
              <Cell className="w-[100px]">
                <span className="block">{activityType}</span>
              </Cell>
              {/* <Cell className="w-[200px]">
                <div className="flex items-center">
                  <div className="h-[42px]">
                    <a href="#">
                      <Image className="rounded-xl" src={imageUrl} alt={name} height="42" width="42" />
                    </a>
                  </div>
                  <div className="ml-3">
                    <span className="block">
                      <a href="#">{ name }</a>
                    </span>
                    <span className="text-manatee">
                      <a href="#">{ collection }</a>
                    </span>
                  </div>
                </div>
              </Cell> */}
                <Cell className="w-[100px] text-center leading-none">
                  <span className="-ml-[8px]">
                    {price ? (
                      <ItemPrice value={price} />
                    ) : '-'}
                  </span>
                  <span className="block text-[10px] text-manatee">
                    { price ? usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd)) : null }
                  </span>
                </Cell>
              <Cell className="w-[100px] text-center">
                  {from ? (
                    <a href="#">
                      { ellipseAddress(from, 4) }
                    </a>
                  ) : '-'}
                </Cell>
                <Cell className="w-[100px] text-center">
                  { to ? (
                    <a href="#">
                      { ellipseAddress(to, 4) }
                    </a>
                   ) : '-'}
                </Cell>
              <Cell className="w-[100px] text-center">
                <div className="group relative">
                  { /* TODO convert date to time ago */ }
                  {/* formatDistanceToNowStrict(date, { addSuffix: true }) */}
                  23 minutes ago
                  <Tooltip position="bottom">
                    <span className="block">13:01 UTC</span>
                    <span>March 12th 2022</span>
                  </Tooltip>
                </div>
              </Cell>
              <Cell className="w-[50px] text-right">
                <a href="#">
                  <LinkIcon className="w-[12px]" />
                </a>
              </Cell>
            </Row>
          );
        })
      }
    </Table>
  );
}