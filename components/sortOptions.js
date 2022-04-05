import { useState } from 'react';
import { stringify, parse } from 'qs';
import { useRouter } from 'next/router'
import Dropdown from './Dropdown/Dropdown';

const sortOptions = [
  { label: 'Token ID', sortBy: 'tokenId', current: true },
  { label: 'Price: Low to High', sortBy: 'lowestPrice', current: false },
  { label: 'Price: High to Low', sortBy: '-highestPrice', current: false },
  { label: 'Bids: High to Low', sortBy: '-highestBid', current: false },
  { label: 'Bids: Low to High', sortBy: 'lowestBid', current: false },
  { label: 'Rarity: Rarest to Common', sortBy: '-rarity', current: false },
  { label: 'Rarity: Common to Rarest', sortBy: 'rarity', current: false },
  { label: 'Recently Listed', sortBy: '-lastListedAt', current: false },
  { label: 'Recently Sold', sortBy: '-lastSoldAt', current: false },
]

export default function SortOptions({ className }) {
  const { push, query, pathname } = useRouter();
  const { address, search } = query;
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  function handleSubmit(value) {
    const newQuery = {
      address,
      ...query,
      sort: value
    };

    push({
      pathname: `${pathname}`,
      query: newQuery,
    });
  }

  return (
    <Dropdown
      className={className}
      selected={selectedSort}
      size="sml"
      onSelect={option => {
        setSelectedSort(option);
        handleSubmit(option.sortBy);
      }}
      list={sortOptions}
    />
  );
}