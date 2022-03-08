import { useCallback, useEffect, useState } from 'react';
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

const url = `https://hexagon-api.onrender.com/collections/`;

async function fetchData(address, query) {
  const activeFilters = parse(query);
  const traits = [];
  activeFilters?.stringTraits?.forEach(traitType => traitType?.values?.forEach(
    trait => {
      traits.push({
        trait_type: traitType.name,
        value: trait
      })
    }
  ));

  console.log(`traits`, traits)
  const res = await fetch(
    `${url}${address}/tokens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ traits })
    }
  );
  const json = await res.json();
  return json;
}

// This will be the Single collection page (NFT collection)
// Route: http://localhost:3000/collection/[address]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35
export default function Collection(props) {
  const { collection, setMobileFiltersOpen, data } = props;
  const router = useRouter()
  const { search, address } = router.query
  const [collectionData, setData] = useState(data);

  const fetchCollection = useCallback(async function() {
    const json = await fetchData(address, search);
    setData(json);
  // eslint-disable-next-line
  }, [address, search]);

  useEffect(() => {
    fetchCollection();
  }, [search, fetchCollection])

  return (
    <List
      items={collectionData}
      sortOptions={sortOptions}
      setMobileFiltersOpen={setMobileFiltersOpen}
      collection={collection}
    />
  );
}

export async function getServerSideProps(context) {
  const { params: { address } } = context;
  const url = `https://hexagon-api.onrender.com/collections/${address}`;
  const collectionUrl = `https://hexagon-api.onrender.com/collections/${address}/tokens?page=0&sort=tokenId&size=20`;
  const res = await fetch(url)
  const data = await res?.json()
  const nftsRes = await fetch(collectionUrl, {
    method: 'POST'
  });
  const nfts = await nftsRes?.json();

  return { props: { data: nfts, collection: data } };
}