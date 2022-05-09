import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { collectionsUrl } from "../constants/url";
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import CollectionCard from '../components/Collection/CollectionCard';
import Spinner from '../components/Spinner/Spinner';
import { LowDollarIcon, CheckedRibbonIcon } from '../components/icons';
import { Icon } from '@iconify/react';

const HIGHLIGHTS = [
  {
    icon: <LowDollarIcon className="text-4xl" />,
    title: 'Low Transaction Fees',
    description: '0% fees for all collections utilizing HNY and 2% fees for all non-HNY collections'
  },
  {
    icon: <CheckedRibbonIcon className="text-4xl" />,
    title: 'High Quality Collections',
    description: 'Each collection on Hexagon is hand-vetted by our curation team to ensure quality'
  },
  {
    icon: <Icon icon="healthicons:money-bag" className="text-4xl" />,
    title: 'Passive Income NFTs',
    description: 'No restrictions on trading passive income NFTs, unlike larger marketplace like OpenSea'
  }
];

export default function Home(props) {
  const [featuredCollections, setCollections] = useState([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);

  const fetchData = useCallback(async function() {
    setIsCollectionLoading(true);
    const chain = process.env.NEXT_PUBLIC_CHAIN;
    const res = await fetch(collectionsUrl({ chain, size: 3 }));
    const collections = await res?.json();
    setCollections(collections?.results);
    setIsCollectionLoading(false);
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const { collections, connect, address } = props;

  if (!collections && !collections?.length) {
    return  (
      <h1 className='px-20 py-10 text-3xl'>No items in Marketplace</h1>
    )
  }

  return (
    <>
      <div className="flex justify-center lg:max-w-6xl mx-auto">

        <div className="w-full">
          <div className="flex flex-col">
            <Hero address="0x19e46be2e3ad8968a6230c8fb140c4ccabc3ce0d" />
            <HeroCards connect={connect} address={address} />

            <section className="mt-6 mb-8">
              <h2 className="text-center text-3xl font-semibold mb-6 gradient-heading">Why Hexagon?</h2>
              <ul className="mt-16 flex flex-col md:flex-row justify-between">
                {
                  HIGHLIGHTS.map(({ icon, title, description }, index) => (
                    <li key={`highlight_${index}`} className={clsx(
                      'flex flex-col justify-between items-center mb-8 text-center md:mx-2 lg:mx-8 first:ml-0 last:mr-0'
                    )}>
                      { icon }
                      <h3 className="mt-2 gradient-text text-ink text-lg mb-4 font-medium">{title}</h3>
                      <p className="dark:text-manatee text-lightGray text-sm px-10">{description}</p>
                    </li>
                  ))
                }
              </ul>
            </section>

            <section className="mt-14 mb-10">
              <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
              {
                isCollectionLoading
                  ? (
                    <div className="flex justify-center items-center h-24">
                      <Spinner className="w-[26px] dark:text-white text-ink" />
                    </div>
                  )
                  : (
                    <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-8">
                        {featuredCollections?.map((collection, index) => collection.address !== '0x19e46be2e3ad8968a6230c8fb140c4ccabc3ce0d' && (
                          <li
                            key={`${collection.address}_${index}`}
                            className="mx-auto w-full h-full">
                            <CollectionCard collection={collection} size="sml" />
                          </li>
                        ))}
                    </ul>
                  )
              }
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const url = `https://api.hexag0n.io/collections?page=0&size=2&chain=${chain}`;
  const res = await fetch(url)
  const data = await res?.json()
  return { props: { collections: data }, revalidate: 30 };
}
