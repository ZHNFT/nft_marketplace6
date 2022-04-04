import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { format, isValid, formatDistanceToNowStrict } from 'date-fns';
import { usdFormatter, formatEther } from '../../Utils/helper';
import { ellipseAddress } from '../../Utils';
import { userUrl } from '../../constants/url';
import { formatCurrency } from '../../Utils/helper';
import { Table, RowHeading, Row, Cell } from '../Table';
import { CartIcon, LinkIcon } from '../icons';
import TransferIcon from '../icons/TransferIcon';
import MintIcon from '../icons/MintIcon';
import AuctionIcon from '../icons/AuctionIcon';
import OfferIcon from '../icons/OfferIcon'; 
import ItemPrice from '../ItemPrice/ItemPrice';
import Tooltip from '../Tooltip/Tooltip';
import Spinner from '../Spinner/Spinner';

export default function Activity({ tokenPriceUsd }) {
  const router = useRouter();
  const { query: { address } } = router;
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = useCallback(async function() {
    setIsLoading(true);
    const url = userUrl({ address, resourceType: 'activity' });
    const res = await fetch(url);
    const data = await res?.json();
    setIsLoading(false);
    setActivities(data);
  }, [address]);

  useEffect(() => {
    fetchData()
  }, [fetchData]);


  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[30px] mobile-only:hidden" />
        <Cell className="w-[100px]">Type</Cell>
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
      { isLoading && <div className="flex flex-1 justify-center my-20"><Spinner className="w-[26px] text-white" /></div> }
      {
        !isLoading && activities?.results?.map((row, index) => {

          const { activityType, fromAddress, toAddress, minBid, _id, expiry, timestamp, pricePerItem, seller, buyer, value, userAddress, tokenId, chain, transactionHash } = row;
          const price = activityType === 'sale' ? value : activityType === 'bid' || activityType === 'listing' ?  pricePerItem : minBid;
          const from = activityType === 'bid' ? userAddress : activityType === 'sale' ? seller : fromAddress;
          const to = activityType === 'sale' ? buyer : toAddress;

          const blockchainViewer = (chain == "mumbai" ? "https://mumbai.polygonscan.com/tx/" : "https://polygonscan.com/tx/");

          const link = blockchainViewer + transactionHash

          const isMinting = activityType == "transfer" && fromAddress == "0x0000000000000000000000000000000000000000";
          const date = new Date(timestamp);
          const { timeAgo, formattedDate, formattedTime } = isValid(date) ? {
            timeAgo: formatDistanceToNowStrict(date, { addSuffix: true }),
            formattedDate: format(date, "MMMM do yyyy"),
            formattedTime: format(date, "h:mm aaa")
          } : {};

          return (
            <Row key={`user_activity_${index}`} className="cursor-pointer" onClick={() => router.push("/collections/" + address + "/token/" + tokenId)}>
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
                {/*<span className="text-manatee">For sale</span>*/}
              </Cell>
              {/*}
              <Cell className="w-[200px]">
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
              </Cell>
              */}
              <Cell className="w-[100px] text-center leading-none">
                {
                  price ? <span className="-ml-[8px]"><ItemPrice value={price} /></span> : '-'
                }
                <span className="block text-[10px] text-manatee">
                { price ? usdFormatter.format(Number(formatEther(price)) * Number(tokenPriceUsd)) : null }
                </span>
              </Cell>
              <Cell className="w-[100px] text-center mobile-only:hidden">
                {/* From address */}
                {
                  from && !isMinting &&  (
                    <Link href={`/users/${from}`}>
                      <a>{ ellipseAddress(from, 4) }</a>
                    </Link>
                  )
                } 
                { !from || isMinting && '-' }
              </Cell>
              <Cell className="w-[100px] text-center mobile-only:hidden">
                {/* To address */}
                {
                  to ? (
                    <Link href={`/users/${to}`}>
                      <a>{ ellipseAddress(to, 4) }</a>
                    </Link>
                  ) : '-'
                }
              </Cell>
              <Cell className="w-[120px] text-center sm:hidden">
                {/* From/To addresses (mobile) */}
                <div>
                  { from ? (
                    isMinting ?
                    "-" :
                    <a href={"/users/" + from}>
                      { ellipseAddress(from, 4) }
                    </a>
                  ) : '-'}
                </div>
                <div>
                  { to ? (
                  <a href={"/users/" + to}>
                    { ellipseAddress(to, 4) }
                  </a>
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
                <a href={link} target="_blank" rel="noreferrer">
                  <span className="sr-only">View transaction in blockchain explorer</span>
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