import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { stringify } from 'qs';
import clsx from 'clsx';
import _ from 'lodash';
import { Table, RowHeading, Row, Cell } from '../Table';
import { DiamondIcon, SearchIcon } from '../icons';

export default function TraitsTable({ collectionId, traits }) {
  const router = useRouter();
  const [sortedTraits, setSortedTraits] = useState();
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    if (traits) {
      setSortedTraits(_.orderBy(traits, ['rarityScore'],  [order]));
    }
  }, [traits, order]);
  return (
    <Table className="text-xs mt-2">
      <RowHeading>
        <Cell className="w-[150px]" />
        <Cell className="w-[75px]">
          <button type="button" onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
            <span className="sr-only">Rarity</span>
            <DiamondIcon className="w-[14px] mr-1" />
            <span className={clsx(
              'inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-manatee mb-[1px] ml-1',
              { 'rotate-180': order === 'desc' }
            )}></span>
            <span className="sr-only">{ order === 'asc' ? 'Sort descending' : 'Sort ascending' }</span>
          </button>
        </Cell>
        <Cell className="w-[100px] text-center">%</Cell>
        <Cell className="w-[50px]" />
      </RowHeading>
      <div className="max-h-[250px] overflow-y-auto scroller">
        {
          sortedTraits?.map((row, index) => {
            const { trait_type: type, value, rarityScore, rarityPercent } = row;
            const traitFilters = { stringTraits: [{ name: type, values: [value] }] };
            const query = { address: collectionId, search: stringify(traitFilters, { encode: false, arrayFormat: 'indices' }) };
            return (
              <Row key={`${type}-${index}`} className="cursor-pointer text-xs !py-2" onClick={() => router.push({ pathname: '/collections/[address]', query })}>
                <Cell className="w-[150px]">
                  <p className="dark:text-manatee text-frost text-xxs capitalize">{ type }</p>
                  <p className="capitalize">{ value }</p>
                </Cell>
                <Cell className="w-[75px]">
                  { rarityScore?.toFixed(2) }
                </Cell>
                <Cell className="w-[100px] text-center leading-none">
                  { rarityPercent?.toFixed(2) }%
                </Cell>
                <Cell className="w-[50px] text-right dark:text-manatee text-frost">
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