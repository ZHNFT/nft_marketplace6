import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { usdFormatter, formatEther } from '../../Utils/helper';
import { ellipseAddress } from '../../Utils';
import { Table, RowHeading, Row, Cell } from '../Table';
import { LinkIcon, CartIcon } from '../icons';

import TransferIcon from '../icons/TransferIcon';
import MintIcon from '../icons/MintIcon';
import AuctionIcon from '../icons/AuctionIcon';
import OfferIcon from '../icons/OfferIcon'; 


import ItemPrice from '../ItemPrice/ItemPrice';
import Tooltip from '../Tooltip/Tooltip';
import { format, isValid, formatDistance, formatRelative, subDays, formatDistanceToNowStrict } from 'date-fns'

export default function Activity({ currency, tokenPriceUsd }) {
  const router = useRouter();
  const { address, id } = router.query;
  const [activities, setActivities] = useState([]);

  const fetchData = useCallback(async function() {

    const url = "https://api.hexag0n.io/collections/"+ address.toString() + "/token/" + id + "/activity?include=sales&include=listings&include=bids&include=auctions"
    const res = await fetch(url)
    const data = await res?.json()

    setActivities(data);

  }, [address, id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!activities?.results || !activities?.results?.length) {
    return <p className="text-center text-xs mt-2 flex h-[100px] justify-center items-center">No activity available</p>
  }

  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[30px] mobile-only:hidden" />
        <Cell className="w-[75px]">Type</Cell>
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
      <div className="max-h-[280px] min-h-[82px] overflow-y-auto scroller">
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
                <Cell className="w-[75px]">
                  <span className="block capitalize">{isMinting ? "Mint" : activityType}</span>
                </Cell>
                <Cell className="w-[100px] text-center leading-none">
                  <span className="-ml-[8px] inline-block">
                    {price ? (
                      <ItemPrice currency={currency} value={price} />
                    ) : '-'}
                  </span>
                  <span className="block text-[10px] text-manatee">
                    { price && tokenPriceUsd ? usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd)) : null }
                  </span>
                </Cell>
                <Cell className="w-[100px] text-center mobile-only:hidden">
                  {/* From address */}
                  {from ? (

                    isMinting ?
                    "-" : 
                    <Link href={"/users/" + from}>
                      { ellipseAddress(from, 4) }
                    </Link>
                  ) : '-'}
                </Cell>
                <Cell className="w-[100px] text-center mobile-only:hidden">
                  {/* To address */}
                  { to ? (
                    <Link href={"/users/" + to}>
                      { ellipseAddress(to, 4) }
                    </Link>
                   ) : '-'}
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
                      ) : '-' }
                  </div>
                  <div className="mt-1">
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
                    <Tooltip position="bottom" className="z-10">
                      <span className="block">{formattedTime}</span>
                      <span>{formattedDate}</span>
                    </Tooltip>
                  </div>
                </Cell>
                <Cell className="w-[50px] text-right">
                  {
                    transactionHash && (
                      <a href={`${blockchainViewer}${transactionHash}`} target="_blank" rel="noreferrer">
                        <span className="sr-only">View transaction in blockchain explorer</span>
                        <LinkIcon className="w-[12px]" />
                      </a>
                    )
                  }
                </Cell>
              </Row>
            );
          })
        }
      </div>
    </Table>
  );
}