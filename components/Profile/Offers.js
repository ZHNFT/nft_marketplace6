import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { format, isValid, formatDistanceToNowStrict, formatDistance } from 'date-fns';
import { usdFormatter, formatEther } from '../../Utils/helper';
import { ellipseAddress } from '../../Utils';
import { offerUrl } from '../../constants/url';
import { formatCurrency } from '../../Utils/helper';
import { Table, RowHeading, Row, Cell } from '../Table';
import { ReceiveIcon } from '../icons';
import OfferIcon from '../icons/OfferIcon';
import ItemPrice from '../ItemPrice/ItemPrice';
import Tooltip from '../Tooltip/Tooltip';
import Spinner from '../Spinner/Spinner';

export default function Offers({ tokenPriceUsd }) {
  const router = useRouter();
  const { query: { address } } = router;
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = useCallback(async function() {
    setIsLoading(true);
    const url = offerUrl({ address });
    const res = await fetch(url);
    const data = await res?.json();
    setIsLoading(false);
    setOffers(data);
  }, [address]);

  useEffect(() => {
    fetchData()
  }, [fetchData]);


  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[30px]" />
        <Cell className="w-[100px]">Type</Cell>
        <Cell className="w-[100px] text-center">Price</Cell>
        <Cell className="w-[100px] text-center">From</Cell>
        <Cell className="w-[100px] text-center">To</Cell>
        <Cell className="w-[100px] text-center">
          <button type="button">
            Date
            <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-manatee mb-[1px] ml-1"></span>
          </button>
        </Cell>
        <Cell className="w-[100px] text-center">Expires</Cell>
        <Cell className="w-[100px] text-center">Options</Cell>
        <Cell className="w-[50px]" />
      </RowHeading>
      { isLoading && <div className="flex flex-1 justify-center my-20"><Spinner className="w-[26px] text-white" /></div> }
      {
        !isLoading && offers?.results?.map((row, index) => {

          const { activityType, from, to, minBid, _id, expiry, timestamp, pricePerItem, seller, buyer, value, userAddress, tokenId, chain, transactionHash, active, accepted, canceled } = row;

          const price = pricePerItem;


          const date = new Date(timestamp);

          const expired = expiry < (date.getTime()/1000) ? true : false;

          const expiryDate = new Date(expiry * 1000);

          const { timeTillExpiry, formattedExpiryDate, formattedExpiryTime } = isValid(expiryDate) ? {
            timeTillExpiry : formatDistance(expiryDate, new Date()),
            formattedExpiryDate: format(expiryDate, "MMMM do yyyy"),
            formattedExpiryTime: format(expiryDate, "h:mm aaa")
          } : {};

          
          const { timeAgo, formattedDate, formattedTime } = isValid(date) ? {
            timeAgo: formatDistanceToNowStrict(date, { addSuffix: true }),
            formattedDate: format(date, "MMMM do yyyy"),
            formattedTime: format(date, "h:mm aaa")
          } : {};

          return (
            <Row key={`user_activity_${index}`} className="cursor-pointer" onClick={() => router.push("/collections/" + address + "/token/" + tokenId)}>
              <Cell className="w-[30px]">
                {activityType == "offerMade" ?
                  
                    <OfferIcon className="w-[16px]" /> :

                    <ReceiveIcon className="w-[16px]" />

                }
              </Cell>
              <Cell className="w-[100px]">
                <span className="block capitalize">{activityType == "offerMade" ? "Made" : "Recieved"}</span>
                {accepted ?
                
                    <span className="text-green">Accepted</span> :

                    canceled ?

                    <span className="text-manatee">Declined</span>
                    
                    : expired ? 

                    <span className="text-manatee">Expired</span> 
                    
                    : 

                    <span className="text-manatee">Active</span>

                }
               
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
              <Cell className="w-[100px] text-center">
                {
                  from  &&  (
                    <Link href={`/users/${from}`}>
                      <a>{ ellipseAddress(from, 4) }</a>
                    </Link>
                  )
                } 
                { !from  && '-' }
              </Cell>
              <Cell className="w-[100px] text-center">
                {
                  to ? (
                    <Link href={`/users/${to}`}>
                      <a>{ ellipseAddress(to, 4) }</a>
                    </Link>
                  ) : '-'
                }
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
              <Cell className="w-[100px] text-center">
                <div className="group relative">
                  {timeTillExpiry}
                  <Tooltip position="bottom">
                    <span className="block">{formattedExpiryTime}</span>
                    <span>{formattedExpiryDate}</span>
                  </Tooltip>
                </div>
              </Cell>


              {  

                //TODO: add on click functionality
                activityType == "offerMade" ?

                <> <Cell className="w-[100px] text-center">
                        <div className="group relative text-green-500">
                            Accept
                        </div>
                    </Cell>
                    <Cell className="w-[100px] text-center">
                        <div className="group relative text-red-500">
                            reject
                        </div>
                    </Cell></> : <span>-</span>

                }

             
            </Row>
          );
        })
      }
    </Table>
  );
}