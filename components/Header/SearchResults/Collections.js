import Image from 'next/image';
import Link from 'next/link';
import { Table, RowHeading, Row, Cell } from '../../Table';
import { BeeIcon } from '../../icons';
import DefaultLogo from "../../../images/default-collection-logo.png";

export default function Collections({ results }) {
  if (!results || !results.length) {
    return <div className="h-[272px] flex justify-center items-center">No items found</div>;
  }

  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[280px]"></Cell>
        <Cell className="w-[100px] text-center">Floor</Cell>
        <Cell className="w-[80px] text-center">Items</Cell>
      </RowHeading>
      <div className="h-[240px] overflow-y-auto scroller">
        {
          results?.map((row, index) => {
            const { id, address, symbol, name, images, floor, totalSupply } = row;
            return (
              <Link key={`collection_results_${index}`} href="/collections/[address]" as={`/collections/${address}`} passHref>
                <div>
                  <Row className="cursor-pointer text-xs !py-2">
                    <Cell className="w-[280px] flex items-center">
                      <Image className="rounded-xl" src={images?.logo || DefaultLogo} alt={name} height="24" width="24" />
                      <div className="ml-3">
                        <span className="text-manatee text-xxs">{ symbol }</span>
                        <p className="text-white">{ name }</p>
                      </div>
                    </Cell>
                    <Cell className="w-[100px] flex flex-col justify-center items-center">
                      <span className="relative -left-[5px] text-white">
                        <BeeIcon className="h-[18px] relative -top-[2px]" />
                        { floor ? floor : "0" }
                      </span>
                    </Cell>
                    <Cell className="w-[80px] text-center leading-none text-white">
                      { totalSupply }
                    </Cell>
                  </Row>
                </div>
              </Link>
            );
          })
        }
      </div>
    </Table>
  );
}