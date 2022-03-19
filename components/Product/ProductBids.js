import { useRouter } from 'next/router';
import { ellipseAddress } from '../../Utils';
import { Table, RowHeading, Row, Cell } from '../Table';
import { BeeIcon, LinkIcon } from '../icons';
import SecondaryButton from '../Buttons/SecondaryButton';

export default function ProductBids({ bids, currentUser, isOwner, onCancelBid, onAcceptBid }) {
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
        <Cell className="w-[140px] text-center"></Cell>
        <Cell className="w-[20px]" />
      </RowHeading>
      <div className="h-[240px] overflow-y-scroll">
        {
          bids.map(bid => {
            const { _id: id, pricePerItem, userAddress, expiry } = bid;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[120px] flex items-center">
                  <span className="block bg-cornflower rounded-full w-[24px] h-[24px] mr-2"></span>
                  <span>{ ellipseAddress(userAddress, 4) }</span>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px]">
                    <BeeIcon className="w-[26px] relative -top-[2px]" />
                    { pricePerItem }
                  </span>
                  <span className="text-manatee text-xxs">$6,450.28</span>
                </Cell>
                <Cell className="w-[100px] text-center leading-none">
                  { expiry }
                </Cell>
                <Cell className="w-[140px] text-right leading-none">
                  {userAddress === currentUser && (
                    <SecondaryButton
                      className="border-manatee mr-4 text-ink dark:text-white"
                      onClick={() => onCancelBid(bid)}
                    >
                      Cancel Bid
                    </SecondaryButton>
                  )}
                  {isOwner && (
                    <SecondaryButton
                      className="border-manatee mr-4 text-ink dark:text-white"
                      onClick={() => onAcceptBid(bid)}
                    >
                      Accept Bid
                    </SecondaryButton>
                  )}
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