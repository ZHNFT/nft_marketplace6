import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { stringify, parse } from 'qs';

// Components
import List from '../../../../components/list';
import getMoralisNode from '../../../../middleware/getMoralisNode';

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
  const { data, collection, setMobileFiltersOpen } = props;
  const { Moralis, isInitialized, isInitializing } = useMoralis();
  const router = useRouter()
  const { search, address, tableName } = router.query
  const activeFilters = parse(search);

  const { data: results, error, isLoading } = useMoralisQuery(
    `${tableName}NFT`,
    (query) => {
      if(activeFilters?.stringTraits?.length) {
        for (let i = 0; i < activeFilters?.stringTraits?.length; i++) {
          const { name, values } = activeFilters.stringTraits[i];
          return query.containedIn(name, values)
        }
      } else return query;
    },
    [search],
  );

  // useEffect(() => {
  //   async function fetchData() {
  //     if (isInitialized && search) {
  //       const activeFilters = parse(search);
  //       const NFT = Moralis.Object.extend(`${tableName}NFT`);
  //       const nftQuery = new Moralis.Query(NFT);
  //       activeFilters?.stringTraits.forEach(trait => {
  //         // nftQuery.equalTo(trait.name, trait.values[0]);
  //         nftQuery.containedIn(trait.name, trait.values);
  //       })
  //       const nftResults = await nftQuery.find();
  //       const results = JSON.parse(JSON.stringify(nftResults));
  //       console.log(`results`, results)
  //       setResults(results);
  //     }
  //   }
  //   fetchData();
  // }, [search, isInitialized])

  return (
    <List
      items={results}
      sortOptions={sortOptions}
      setMobileFiltersOpen={setMobileFiltersOpen}
      collection={collection}
    />
  );
}

export async function getServerSideProps(context) {
  const { params: { tableName, address } } = context;
  const moralis = getMoralisNode();
  const collection = moralis.Object.extend("WhitelistedCollection");
  const collectionQuery = new moralis.Query(collection);
  collectionQuery.equalTo("contractAddress", address)
  const result = await collectionQuery.find();

  const collectionData = JSON.parse(JSON.stringify(result[0]));

  const NFT = moralis.Object.extend(`${tableName}NFT`);
  const nftQuery = new moralis.Query(NFT);
  nftQuery.limit(20);
  const nftResults = await nftQuery.find();
  const data = JSON.parse(JSON.stringify(nftResults));
  
  return { props: { data, collection: collectionData } };
}