import { useState, useEffect, useCallback } from 'react';
import { ethers } from "ethers";
import { useRouter } from 'next/router';
import Image from 'next/image';
import { formatCurrency } from '../../Utils/helper';
import { ellipseAddress } from '../../Utils';
import { Table, RowHeading, Row, Cell } from '../Table';
import { CartIcon, LinkIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';
import Tooltip from '../Tooltip/Tooltip';

export default function Activity() {
  const router = useRouter();
  const { address, id } = router.query;
  const [activities, setActivities] = useState([]);

  const fetchData = useCallback(async function() {
    const url = `https://hexagon-api.onrender.com/collections/${address}/token/${id}/activity?include=sales&include=listings&include=bids&include=transfers&include=auctions`;
    const res = await fetch(url)
    const data = await res?.json()
    setActivities(data);
  }, [address, id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  console.log(`activities`, activities)
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[30px]" />
        <Cell className="w-[75px]">Type</Cell>
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
      <div className="max-h-[280px] overflow-y-auto scroller">
        {
          activities?.results?.map(row => {
            const { activityType, fromAddress, toAddress, minBid, _id, expiry, pricePerItem } = row;
            const price = activityType === 'listing' ? pricePerItem : minBid;
            return (
              <Row key={_id} className="cursor-pointer" onClick={() => router.push('#')}>
                <Cell className="w-[30px]">
                  <CartIcon className="w-[16px]" />
                </Cell>
                <Cell className="w-[75px]">
                  <span className="block">{activityType}</span>
                </Cell>
                <Cell className="w-[100px] text-center leading-none">
                  <span className="-ml-[8px]">
                    {price ? (
                      <ItemPrice value={ethers.utils.formatEther(ethers.BigNumber.from(price.toString()))} />
                    ) : '-'}
                  </span>
                  <span className="block text-[10px] text-manatee">
                    { price ? formatCurrency({ value: price }) : '-' }
                  </span>
                </Cell>
                <Cell className="w-[100px] text-center">
                  {fromAddress ? (
                    <a href="#">
                      { ellipseAddress(fromAddress, 4) }
                    </a>
                  ) : '-'}
                </Cell>
                <Cell className="w-[100px] text-center">
                  { toAddress ? (
                    <a href="#">
                      { ellipseAddress(toAddress, 4) }
                    </a>
                   ) : '-'}
                </Cell>
                <Cell className="w-[100px] text-center">
                  <div className="group relative">
                    { /*TODO convert date to time ago */ }
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
      </div>
    </Table>
  );
}