import { useRouter } from 'next/router';
import { ellipseAddress } from '../../Utils';
import { Table, RowHeading, Row, Cell } from '../Table';
import { BeeIcon, LinkIcon } from '../icons';

export default function ProductOffers({ offers }) {
  const router = useRouter();
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[130px]"></Cell>
        <Cell className="w-[100px] text-center">Offer</Cell>
        <Cell className="w-[100px] text-center">Expires</Cell>
        <Cell className="w-[50px]" />
      </RowHeading>
      <div className="h-[240px] overflow-y-scroll">
        {
          offers.map((row, index) => {
            const { _id: id, pricePerItem, userAddress, expiry } = row;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[130px] flex items-center">
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
                <Cell className="w-[50px] text-right text-manatee">
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