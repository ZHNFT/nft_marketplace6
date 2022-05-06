import Image from 'next/image';
import Link from 'next/link';
import { resolveBunnyLink } from '../../../Utils';
import { Table, RowHeading, Row, Cell } from '../../Table';
import CurrencyIcon from '../../CurrencyIcon/CurrencyIcon';
import DefaultLogo from "../../../images/default-collection-logo.png";

export default function Collections({ results }) {
  if (!results || !results.length) {
    return <div className="h-[272px] flex justify-center items-center">No collections found</div>;
  }

  return (
    <Table className="text-xs dark:text-manatee text-ink">
      <RowHeading>
        <Cell className="w-[280px]"></Cell>
        <Cell className="w-[100px] text-center">Floor</Cell>
        <Cell className="w-[80px] text-center">Items</Cell>
      </RowHeading>
      <div className="h-[240px] overflow-y-auto scroller">
        {
          results?.map((row, index) => {
            const { id, address, symbol, name, images, floor, totalSupply, currency } = row;
            const logo = images?.logo && images?.logo.startsWith('ipfs:') ? `${resolveBunnyLink(images?.logo)}?optimizer=image&width=24&aspect_ratio=1:1` : images?.logo;
            return (
              <Link key={`collection_results_${index}`} href="/collections/[address]" as={`/collections/${address}`} passHref>
                <a>
                  <Row className="cursor-pointer text-xs !py-2">
                    <Cell className="w-[280px] flex items-center">
                      <Image className="rounded-xl" src={logo || DefaultLogo} alt={name} height="24" width="24" />
                      <div className="ml-3">
                        <span className="dark:text-manatee text-frost text-xxs">{ symbol }</span>
                        <p className="dark:text-white text-ink">{ name }</p>
                      </div>
                    </Cell>
                    <Cell className="w-[100px] flex flex-col justify-center items-center">
                      <span className="relative -left-[5px] dark:text-white text-malibu flex items-center">
                        <span className="inline-block mr-1.5 min-w-[11px]">
                          <CurrencyIcon currency={currency?.symbol} hnyClassName="h-[14px] relative -top-[1px] -mr-1 pr-[5px]" />
                        </span>
                        { floor ? floor : "0" }
                      </span>
                    </Cell>
                    <Cell className="w-[80px] text-center leading-none dark:text-white text-malibu">
                      { totalSupply }
                    </Cell>
                  </Row>
                </a>
              </Link>
            );
          })
        }
      </div>
    </Table>
  );
}