import { useRouter } from 'next/router';
import { Table, RowHeading, Row, Cell } from '../Table';
import { DiamondIcon, SearchIcon } from '../icons';

export default function TraitsTable({ traits }) {
  const router = useRouter();
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[150px]" />
        <Cell className="w-[75px]">
          <button type="button">
            <span className="sr-only">Rarity</span>
            <DiamondIcon className="w-[14px] mr-1" />
            <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-manatee mb-[1px] ml-1"></span>
          </button>
        </Cell>
        <Cell className="w-[100px] text-center">%</Cell>
        <Cell className="w-[50px]" />
      </RowHeading>
      <div className="h-[250px] overflow-y-scroll">
        {
          traits.map((row, index) => {
            const { trait_type: type, value, rarityScore, rarityPercent } = row;
            return (
              <Row key={`${type}-${index}`} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[150px]">
                  <p className="text-manatee text-xxs capitalize">{ type }</p>
                  <p className="capitalize">{ value }</p>
                </Cell>
                <Cell className="w-[75px]">
                  { rarityScore?.toFixed(2) }
                </Cell>
                <Cell className="w-[100px] text-center leading-none">
                  { rarityPercent?.toFixed(2) }%
                </Cell>
                <Cell className="w-[50px] text-right text-manatee">
                  <a href="#">
                    <SearchIcon className="w-[13px]" />
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