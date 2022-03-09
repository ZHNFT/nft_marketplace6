import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { stringify, parse } from 'qs';

// Components
import List from '../../../components/list';

const url = `https://hexagon-api.onrender.com/collections/`;

async function fetchData(address, query, sort) {
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

  const res = await fetch(
    `${url}${address}/tokens${sort ? `?${stringify({ sort })}` : ''}`,
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
  const { search, address, sort } = router.query
  const [collectionData, setData] = useState(data);

  const fetchCollection = useCallback(async function() {
    const json = await fetchData(address, search, sort);
    setData(json);
  // eslint-disable-next-line
  }, [address, search, sort]);

  useEffect(() => {
    fetchCollection();
  }, [search, fetchCollection])

  console.log(`collectionData`, collectionData)

  return (
    <List
      items={collectionData?.results}
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