import { useState } from 'react';
import Image from 'next/image';
import { formatCompact } from '../../Utils/helper';
import Dropdown from "../Dropdown/Dropdown";
import { Table } from '../Table';
import { RowHeading, Cell, Row } from '../Table';
import DefaultLogo from '../../images/default-collection-logo.png';
import { ViewIcon, BeeIcon } from '../icons';
import PriceChangePercent from '../PriceChangePercent/PriceChangePercent';

const filterList = [
  { label: 'Last 24 hours' },
  { label: 'Last 7 days' },
  { label: 'Last 30 days' }
];

export default function Statistics({ collections }) {
  const [filter, setFilter] = useState(filterList[1]);
  console.log(collections);
  return (
    <section className="mt-10">
      <div className="flex justify-between">
        <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
        <div className="flex items-center ">
          <span className="text-manatee text-xxs whitespace-nowrap">{collections?.length} collections</span>
          <Dropdown className="ml-4 max-w-[128px]" size="sml" selected={filter} onSelect={setFilter} list={filterList} />
        </div>
      </div>
      <Table className="text-xs">
        <RowHeading>
          <Cell className="w-[30px]" />
          <Cell className="w-[38px]" />
          <Cell className="w-[200px]">Collection name</Cell>
          <Cell className="w-[250px]"></Cell>
          <Cell className="w-[100px] text-center">Items</Cell>
          <Cell className="w-[100px] text-center">Owners</Cell>
          <Cell className="w-[150px] text-center">
            <button type="button">
              Volume
              <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-manatee mb-[1px] ml-1"></span>
            </button>
          </Cell>
          <Cell className="w-[100px] text-center">Floor</Cell>
          <Cell className="w-[100px]" />
        </RowHeading>
        {
          collections.map((row, index) => {
            const { name, symbol, images, itemCount, volume } = row;
            return (
              <Row key={index} className="cursor-pointer" onClick={() => router.push('#')}>
                <Cell className="w-[30px] text-manatee">{index < 9 && 0 }{ index + 1}</Cell>
                <Cell className="w-[38px]">
                  <span className="inline-block rounded-full overflow-hidden w-[26px] h-[26px]  mr-1.5">
                    <Image className="h-8 w-8" src={images?.logo || DefaultLogo} alt={name} width={"100%"} height={"100%"} />
                  </span>
                </Cell>
                <Cell className="w-[200px] truncate">
                  { name }
                  <span className="block text-manatee text-xxs">{ symbol }</span>
                </Cell>
                <Cell className="w-[250px]">
                  <span className="rounded-xl dark:bg-white/[0.05] bg-black/[0.05] py-1 px-3">Utility</span>
                  <span className="rounded-xl dark:bg-white/[0.05] bg-black/[0.05] py-1 px-3 ml-2">25% listed</span>
                </Cell>
                <Cell className="w-[100px] text-center">{ itemCount || 0 }</Cell>
                <Cell className="w-[100px] text-center">36.2K</Cell>
                <Cell className="w-[150px] text-center flex justify-between">
                  <div className="w-[100px]">
                    <span className="-ml-[8px]">
                      <BeeIcon className="h-[18px] -top-[2px] relative" />
                      {
                        volume?.total
                          ? <span className="text-sm">{formatCompact(volume?.total)}</span>
                          : <span className="text-xs">No data</span>
                      }
                    </span>
                    <span className="block text-[10px] text-manatee">
                      $167,000,000
                    </span>
                  </div>
                    <PriceChangePercent change={-23} />
                  <div>

                  </div>
                </Cell>
                <Cell className="w-[100px] text-center">
                  <span className="-ml-[8px]">
                    <BeeIcon className="h-[18px] -top-[2px] relative" />
                    <span className="text-sm">24</span>
                  </span>
                  <span className="block text-[10px] text-manatee">
                   $8,412.89
                  </span>
                </Cell>
                <Cell className="w-[100px]" />
              </Row>
            );
          })
        }
      </Table>
    </section>
  );
};