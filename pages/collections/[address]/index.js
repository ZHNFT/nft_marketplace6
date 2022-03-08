import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { stringify, parse } from 'qs';

// Components
import List from '../../../components/list';

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

// This will be the Single collection page (NFT collection)
// Route: http://localhost:3000/collection/[address]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35
export default function Collection(props) {
  const { collection, setMobileFiltersOpen, data } = props;
  const router = useRouter()
  const { search, address, tableName } = router.query
  const activeFilters = parse(search);
  console.log(`data`, data)
  
  // const { data: results, error, isLoading } = someHookToFetchData(
  //   `${tableName}NFT`,
  //   (query) => {
  //     if(activeFilters?.stringTraits?.length) {
  //       for (let i = 0; i < activeFilters?.stringTraits?.length; i++) {
  //         const { name, values } = activeFilters.stringTraits[i];
  //         return query.containedIn(name, values)
  //       }
  //     } else return query;
  //   },
  //   [search],
  // );

  return (
    <List
      items={data}
      sortOptions={sortOptions}
      setMobileFiltersOpen={setMobileFiltersOpen}
      collection={collection}
    />
  );
}

export async function getServerSideProps(context) {
  const { params: { address } } = context;
  const url = `https://hexagon-api.onrender.com/collections/${address}`;
  const collectionUrl = `https://hexagon-api.onrender.com/collections/${address}/tokens?page=1&sort=tokenId&size=20`;
  const res = await fetch(url)
  const data = await res?.json()
  const nftsRes = await fetch(collectionUrl, {
    method: 'POST'
  });
  const nfts = await nftsRes?.json();
  console.log(`nfts`, nfts)

  return { props: { data: nfts, collection: data } };
}