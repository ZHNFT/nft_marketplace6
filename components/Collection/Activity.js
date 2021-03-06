import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { usdFormatter, formatEther } from '../../Utils/helper';
import { ellipseAddress } from '../../Utils';
import { Table, RowHeading, Row, Cell } from '../Table';
import {LinkIcon, CartIcon } from '../icons';
import TransferIcon from '../icons/TransferIcon';
import MintIcon from '../icons/MintIcon';
import AuctionIcon from '../icons/AuctionIcon';
import OfferIcon from '../icons/OfferIcon'; 
import ItemPrice from '../ItemPrice/ItemPrice';
import Tooltip from '../Tooltip/Tooltip';
import { format, isValid, formatDistanceToNowStrict } from 'date-fns'
import Link from 'next/link';


export default function Activity({ currency, tokenPriceUsd }) {
  const router = useRouter();
  const { address } = router.query;
  const [activities, setActivities] = useState([]);

  const fetchData = useCallback(async function() {
    const url = `https://api.hexag0n.io/collections/${address}/activity?include=sales&include=listings&include=bids`;
    const res = await fetch(url)
    const data = await res?.json()
    setActivities(data);
  }, [address])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Table className="text-xs mobile-only:w-[320px] lg:w-10/12 mobile-only:mx-auto">
      <RowHeading>
        <Cell className="w-[30px] mobile-only:hidden" />
        <Cell className="w-[100px]">Type</Cell>
        <Cell className="w-[100px]">Id</Cell>
        {/* <Cell className="w-[200px]">Item</Cell> */}
        <Cell className="w-[100px] text-center">Price</Cell>
        <Cell className="w-[100px] text-center mobile-only:hidden">From</Cell>
        <Cell className="w-[100px] text-center mobile-only:hidden">To</Cell>
        <Cell className="w-[120px] text-center sm:hidden">From/To</Cell>
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
          const { activityType, fromAddress, toAddress, minBid, _id, expiry, pricePerItem, seller, buyer, value, blockNumber, blockTimestamp, transactionHash, userAddress, tokenId, chain, timestamp } = row;
          const price = activityType === 'sale' ? value : activityType === 'bid' || activityType === 'listing' ?  pricePerItem : minBid;
          const from = activityType === 'bid' ? userAddress : activityType === 'sale' ? seller : fromAddress;
          const to = activityType === 'sale' ? buyer : toAddress;

          const date = new Date(timestamp);
          const { timeAgo, formattedDate, formattedTime } = isValid(date) ? {
            timeAgo: formatDistanceToNowStrict(date, { addSuffix: true }),
            formattedDate: format(date, "MMMM do yyyy"),
            formattedTime: format(date, "h:mm aaa")
          } : {};

          let blockchainViewer;

          if(chain == "mumbai") {
            blockchainViewer = "https://mumbai.polygonscan.com/tx/"
          } else {
            blockchainViewer = "https://polygonscan.com/tx/"
          }

          let isMinting = false;
          if(activityType == "transfer") {
            if(fromAddress == "0x0000000000000000000000000000000000000000") {
              isMinting = true;
            }
          }
          return (
            <Row key={_id}>
              <Cell className="w-[30px] mobile-only:hidden">
              {activityType == "transfer" ? isMinting ?

                <MintIcon className="w-[16px]" /> :

                <TransferIcon className="w-[16px]" /> :

                activityType == "sale" || activityType == "listing"? 

                  <CartIcon className="w-[16px]" /> :

                  activityType == "bid" ?

                  <OfferIcon className="w-[16px]" /> :

                  <AuctionIcon className="w-[16px]" />
                }
              </Cell>
              <Cell className="w-[100px]">
                <span className="block capitalize">{isMinting ? "mint" : activityType}</span>
              </Cell>
              <Cell className="w-[100px]">
                <Link href="/collections/[address]/token/[id]" as={`/collections/${address}/token/${tokenId}`} passHref>
                  <a className='text-cornflower hover:underline'>
                    #{tokenId}
                  </a>
                </Link>
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
                  <span className="-ml-[8px] inline-block">
                    {price ? (
                      <ItemPrice currency={currency} value={price} />
                    ) : '-'}
                  </span>
                  <span className="block text-[10px] dark:text-manatee text-frost">
                    { price ? usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd)) : null }
                  </span>
                </Cell>
              <Cell className="w-[100px] text-center mobile-only:hidden">
                {/* From address */}
                { from ? (
                  isMinting ?
                  "-" :
                  <Link href={"/users/" + from}>
                    { ellipseAddress(from, 4) }
                  </Link>
                ) : '-' }
              </Cell>
              <Cell className="w-[100px] text-center mobile-only:hidden">
                {/* To address */}
                { to ? (
                  <Link href={"/users/" + to}>
                    { ellipseAddress(to, 4) }
                  </Link>
                  ) : '-' }
              </Cell>
              <Cell className="w-[120px] text-center sm:hidden">
                {/* From/To addresses (mobile) */}
                <div>
                  { from ? (
                    isMinting ?
                    "-" :
                    <Link href={"/users/" + from}>
                      { ellipseAddress(from, 4) }
                    </Link>
                  ) : '-'}
                </div>
                <div>
                  { to ? (
                  <Link href={"/users/" + to}>
                    { ellipseAddress(to, 4) }
                  </Link>
                  ) : '-' }
                </div>
              </Cell>
              <Cell className="w-[100px] text-center">
                <div className="group relative">
                  {timeAgo}
                  <Tooltip position="bottom">
                    <span className="block">{formattedTime}</span>
                    <span>{formattedDate}</span>
                  </Tooltip>
                </div>
              </Cell>
              <Cell className="w-[50px] text-right">
                {
                  transactionHash && (
                    <a href={`${blockchainViewer}${transactionHash}`} target="_blank" rel="noreferrer" >
                      <span className="sr-only">View transaction in blockchain explorer</span>
                      <LinkIcon className="w-[12px] text-cornflower" />
                    </a>
                  )
                }
              </Cell>
            </Row>
          );
        })
      }
    </Table>
  );
}