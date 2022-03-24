import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { stringify, parse } from 'qs';
import clsx from 'clsx';
import Sidebar from '../../../components/sidebar';
import Filters from '../../../components/Filters/Filters';
import Tabs from '../../../components/Tabs/Tabs';
import FilterButton from '../../../components/FilterButton/FilterButton';
import Dropdown from '../../../components/Dropdown/Dropdown';
import CollectionHeader from '../../../components/Collection/CollectionHeader';
import Activity from '../../../components/Collection/Activity';
import Gallery from '../../../components/Gallery/Gallery';
import SortOptions from '../../../components/sortOptions';
import { ArrowAltIcon } from '../../../components/icons';

const url = `https://hexagon-api.onrender.com/collections/`;

const itemsFilterList = [
  { label: 'All items' },
  { label: 'Single items' },
  { label: 'Bundles' }
];

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
  const { collection, setMobileFiltersOpen, data, chainIdHex } = props;
  const { createdAt, name, description, images, totalSupply, traits, ownerCount, volume, floorPrice, socials } = collection;
  const router = useRouter();
  const { search, address, sort, tab } = router.query;
  const [collectionData, setData] = useState(data);
  const [selectedItemsFilter, setSelectedItemsFilter] = useState(itemsFilterList[0]);
  const [showFilters, setShowFilters] = useState(true);
  const tabs = [
    { href: { pathname: router.pathname, query: { ...router.query, tab: 'items' } }, name: 'NFTs' },
    { href: { pathname: router.pathname, query: { ...router.query, tab: 'activity' } }, name: 'Activity' }
  ];

  const fetchCollection = useCallback(async function() {
    const json = await fetchData(address, search, sort);
    setData(json);
  // eslint-disable-next-line
  }, [address, search, sort]);

  useEffect(() => {
    fetchCollection();
  }, [search, fetchCollection])

  return (
    <>
      <div className="lg:max-w-6xl mx-auto"> {console.log(collection)} {console.log(collectionData)}
        <CollectionHeader
          chainIdHex={chainIdHex}
          address={address}
          createdAt={createdAt}
          name={name}
          description={description}
          logo={images?.logo}
          totalSupply={totalSupply}
          socials={socials} 
          ownerCount={ownerCount}
          volume={volume.total}
          floorPrice={floorPrice}
        />
        <section className="flex flex-col lg:flex-row lg:grid lg:grid-cols-12 mb-8">
          <div className="flex col-span-12 lg:col-span-7 items-center ml-5">
            <Tabs list={tabs} />
          </div>
          <div className="flex lg:col-span-5 items-center justify-end mt-4 lg:mt-0">
            <span className="mr-4"><FilterButton filters={traits} /></span>
            <Dropdown className="mr-4 max-w-[128px]" size="sml" selected={selectedItemsFilter} onSelect={setSelectedItemsFilter} list={itemsFilterList} />
            <SortOptions className="max-w-[180px]" />
          </div>
        </section>
      </div>
      <section className={clsx(
        'mt-14 flex justify-around lg:justify-between mx-auto transition-max-w duration-300 ease-in-out',
        showFilters ? 'lg:max-w-[1400px]' : 'lg:max-w-6xl'
      )}>
        <>
          <Sidebar className={clsx(
            'w-[200px] flex-shrink-0 transition-all duration-300 ease-in-out lg:mr-2',
            showFilters ? 'delay-75' : '-ml-2 w-0 '
          )}>
            <button
              className="absolute right-0 top-0 w-[38px] h-[38px] border-[0.5px] border-silver rounded-full"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="sr-only">
                { showFilters ? 'Hide filters' : 'Show filters' }
              </span>
              <ArrowAltIcon className="w-[12px]" type={showFilters ? 'right' : 'left' } />
            </button>
            <div className={clsx(
              'mt-5 transition-opacity',
              showFilters ? 'opacity-1 delay-300' : 'opacity-0 duration-150'
            )}>
              <Filters
                placement="desktop"
                filters={collection?.traits}
                total={collectionData?.total}
              />
            </div>
          </Sidebar>
          <div>
            {
              tab === 'activity'
                ? <Activity />
                : <Gallery items={collectionData?.results} />
            }
          </div>
        </>
      </section>
    </>
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