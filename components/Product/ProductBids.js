import { useRouter } from 'next/router';
import { ethers } from "ethers";
import { ellipseAddress } from '../../Utils';
import { formatEther, usdFormatter } from '../../Utils/helper';
import { Table, RowHeading, Row, Cell } from '../Table';
import { BeeIcon, LinkIcon } from '../icons';
import fromUnixTime from 'date-fns/fromUnixTime'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

export default function ProductBids({ bids, tokenPriceUsd }) {
  const router = useRouter();

  if (!bids || bids.length === 0) {
    return <p className="text-center text-xs mt-2">No bids available</p>
  }
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[120px]">Bidder</Cell>
        <Cell className="w-[100px] text-center">Bid</Cell>
        <Cell className="w-[100px] text-center">Date</Cell>
        <Cell className="w-[20px]" />
      </RowHeading>
      <div className="h-[240px] overflow-y-scroll">
        {
          bids.map(bid => {
            const { bidder, timestamp, value } = bid;
            return (
              <Row key={`${bidder}-${timestamp}`} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[120px] flex items-center">
                  <span className="block bg-cornflower rounded-full w-[24px] h-[24px] mr-2"></span>
                  <span>{ ellipseAddress(bidder, 4) }</span>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px]">
                    <BeeIcon className="w-[26px] relative -top-[2px]" />
                    { formatEther(value) }
                  </span>
                  <span className="text-manatee text-xxs">{usdFormatter.format(Number(formatEther(value)) * tokenPriceUsd)}</span>
                </Cell>
                <Cell className="w-[100px] text-center leading-none">
                  {/* https://date-fns.org/v2.28.0/docs/formatDistanceToNowStrict */}
                  { formatDistanceToNowStrict(fromUnixTime(timestamp), { addSuffix: true }) }
                </Cell>
                <Cell className="w-[20px] text-right text-manatee">
                  <a href="#">
                    <LinkIcon className="w-[13px]" />
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