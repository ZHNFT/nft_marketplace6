import { Fragment, useState } from 'react';
import clsx from "clsx";
import { stringify, parse } from 'qs';
import { useRouter } from 'next/router'
import Dropdown from './Dropdown/Dropdown';

const sortOptions = [
  { label: 'Most Popular', sortBy: '#', current: true },
  { label: 'Best Rating', sortBy: '#', current: false },
  { label: 'Newest', sortBy: '#', current: false },
  { label: 'Price: Low to High', sortBy: 'lowestPrice', current: false },
  { label: 'Price: High to Low', sortBy: '-highestPrice', current: false },
  { label: 'Bids: High to Low', sortBy: '-highestBid', current: false },
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