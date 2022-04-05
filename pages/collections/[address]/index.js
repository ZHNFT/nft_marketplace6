import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router'
import { stringify, parse } from 'qs';
import clsx from 'clsx';
import { toFixedOptional } from '../../../Utils/helper';
import FiltersContext from '../../../contexts/FiltersContext';
import Sidebar from '../../../components/sidebar';
import Filters from '../../../components/Filters/Filters';
import FiltersTags from '../../../components/Filters/FiltersTags';
import Tabs from '../../../components/Tabs/Tabs';
import FilterButton from '../../../components/FilterButton/FilterButton';
import Dropdown from '../../../components/Dropdown/Dropdown';
import CollectionHeader from '../../../components/Collection/CollectionHeader';
import Activity from '../../../components/Collection/Activity';
import InfiniteGallery from '../../../components/Gallery/InfiniteGallery';
import SortOptions from '../../../components/sortOptions';
import { ArrowAltIcon } from '../../../components/icons';
import CollectionTab from '../../../components/Tabs/CollectionTab';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { formatEther } from '../../../Utils/helper';

const url = `https://api.hexag0n.io`;

const itemsFilterList = [
  { label: 'All Items' },
  { label: 'For Sale' },
  { label: 'Auction' },
  { label: 'Has Offers' },
  { label: 'Not Listed' }
];

export async function fetchData({asPath, page = 0, search, filter, sort, priceFrom, priceTo, rarityFrom, rarityTo, method}) {
  const basePath = asPath.split('?')[0];
  const activeFilters = parse(search);
  const traits = [];
  activeFilters?.stringTraits?.forEach(traitType => traitType?.values?.forEach(
    trait => {
      traits.push({
        trait_type: traitType.name,
        value: trait
      })
    }
  ));
  
  let apiUrl = `${url}${basePath}/tokens?page=${page}&size=20${filter ? `&${stringify({ filter })}` : ''}${sort ? `&${stringify({ sort })}` : ''}`;
  apiUrl = `${apiUrl}${priceFrom ? `&priceFrom=${priceFrom}` : ''}${priceTo ? `&priceTo=${priceTo}` : ''}`;
  apiUrl = `${apiUrl}${rarityFrom ? `&rarityFrom=${rarityFrom}` : ''}${rarityTo ? `&rarityTo=${rarityTo}` : ''}`;
  const res = await fetch(
    apiUrl,
    {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      ...(traits && traits.length ? { body: JSON.stringify({ traits }) } : {})
    }
  );
  const json = await res.json();
  return json;
}

// This will be the Single collection page (NFT collection)
// Route: http://localhost:3000/collection/[address]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35
export default function Collection(props) {
  const { collection, setMobileFiltersOpen, data, chainIdHex, tokenData } = props;
  const { createdAt, name, description, images, totalSupply, traits, ownerCount, volume, floorPrice, socials, rarity } = collection;
  const router = useRouter();
  const { pathname, query, asPath } = router;
  const { search, address, sort, filter, tab, priceFrom, priceTo, rarityFrom, rarityTo } = query;
  const [collectionData, setData] = useState(data);
  const [selectedItemsFilter, setSelectedItemsFilter] = useState(itemsFilterList[0]);
  const [showFilters, setShowFilters] = useState();
  const tabs = [
    { href: "", name: 'NFTs' },
    { href: "?tab=activity", name: 'Activity' }
  ];

  const minRarity = toFixedOptional({ value: rarity?.lowest, decimals: 2 });
  const maxRarity = toFixedOptional({ value: rarity?.highest, decimals: 2 });

  let minPrice = collection.floorPrice ? formatEther(collection.floorPrice) : 0;
  let maxPrice = collection.highestPrice ? formatEther(collection.highestPrice) : 0;

  maxPrice = parseFloat(maxPrice);
  minPrice = parseFloat(minPrice)

  const fetchCollection = useCallback(async function() {
    const json = await fetchData({ asPath, page: 0, search, filter, sort, priceFrom, priceTo, rarityFrom, rarityTo, method: 'POST' });
    setData(json);
  // eslint-disable-next-line
  }, [address, search, filter, sort, priceFrom, priceTo, rarityFrom, rarityTo]);

  const [traitFilters, setTraitFilters] = useState();
  const [queryFilters, setQueryFilters] = useState();
  const [isPriceReset, setIsPriceReset] = useState();
  const [isRarityReset, setIsRarityReset] = useState();
  const [isFormReset, setIsFormReset] = useState();
  const filtersContextValue = useMemo(
    () => ({ traitFilters, setTraitFilters, queryFilters, setQueryFilters, isPriceReset, setIsPriceReset, isRarityReset, setIsRarityReset, isFormReset, setIsFormReset }), 
    [traitFilters, queryFilters, isPriceReset, isRarityReset, isFormReset]
  );

  useEffect(() => {
    setShowFilters(window?.innerWidth > 639);
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [search, fetchCollection])

  return (
    <FiltersContext.Provider value={filtersContextValue}>
      <div className="lg:max-w-6xl mx-auto">
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
          volume={volume?.total}
          floorPrice={floorPrice}
        />
        <section className="flex flex-col lg:flex-row lg:grid lg:grid-cols-12 mb-8">
          <div className="flex col-span-12 lg:col-span-7 items-center ml-5">
            <Tabs list={tabs} tabComponent={CollectionTab} address={address} />
          </div>
          <div className="flex lg:col-span-5 items-center justify-end mt-4 lg:mt-0">
            {/*<span className="mr-4"><FilterButton filters={traits} /></span>*/}
            
            {/* <Dropdown className="mr-4 max-w-[128px]" size="sml" selected={selectedItemsFilter} onSelect={setSelectedItemsFilter} list={itemsFilterList} /> */}
            <SortOptions className="max-w-[180px]" />
            
          </div>
        </section>
      </div>
      <section className={clsx(
        'mt-14 flex justify-between md:justify-around lg:justify-between mx-auto transition-max-w duration-300 ease-in-out',
        showFilters ? 'max-w-6xl lg:max-w-[1400px]' : 'max-w-6xl lg:max-w-6xl'
      )}>
        <>
          <Sidebar className={clsx(
            'w-full sm:w-[200px] flex-shrink-0 transition-all duration-300 ease-in-out lg:mr-2',
            'fixed z-20 sm:relative top-0 sm:top-auto bottom-0 left-0 sm:left-auto mobile-only:bg-[#1f2225] mobile-only:overflow-y-auto mobile-only:overflow-x-hidden',
            showFilters ? 'delay-75' : '-ml-2 w-0 sm:w-0 mobile-only:px-0'
          )}>
            <button
              className="absolute right-0 top-0 w-[38px] h-[38px] border-[0.5px] border-silver rounded-full hidden sm:block"
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
                minRarity={minRarity}
                maxRarity={maxRarity}
                filters={collection?.traits}
                total={collectionData?.total}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
          </Sidebar>
          {
            tab === 'activity'
              ? (
                <div className='flex flex-1 justify-center'>
                  <Activity tokenPriceUsd={tokenData?.priceUsd} />
                </div>
              )
              : (
                <div className={clsx('mobile-only:w-full')}>
                  <FiltersTags />
                  <InfiniteGallery collectionData={collectionData} />
                </div>
              )
          }
          {
            !tab && (
              <div className="fixed bottom-[20px] left-0 right-0 text-center sm:hidden z-20">
                <PrimaryButton
                  className="!px-10"
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filter
                </PrimaryButton>
              </div>
            )
          }
        </>
      </section>
    </FiltersContext.Provider>
  );
}

export async function getStaticPaths() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const url = `https://api.hexag0n.io/collections?page=0&size=20&sort=name&chain=${chain}`
  const res = await fetch(url)
  const collections = await res?.json()

  // Get the paths we want to pre-render based on posts
  const paths = collections?.results?.map((collection) => ({
    params: { address: collection.address },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { address } = params;
  const url = `https://api.hexag0n.io/collections/${address}`;
  const collectionUrl = `https://api.hexag0n.io/collections/${address}/tokens?page=0&sort=tokenId&size=20`;
  const res = await fetch(url)
  const data = await res?.json()
  const nftsRes = await fetch(collectionUrl, {
    method: 'POST'
  });
  const nfts = await nftsRes?.json();

  return { 
    props: { data: nfts, collection: data },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}