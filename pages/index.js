import { useState, useCallback, useEffect, useContext } from 'react';
import { useRouter } from "next/router";
import clsx from 'clsx';
import { collectionsUrl } from "../constants/url";
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import CollectionCard from '../components/Collection/CollectionCard';
import Spinner from '../components/Spinner/Spinner';
import { LowDollarIcon, CheckedRibbonIcon } from '../components/icons';
import { Icon } from '@iconify/react';
import Web3Context from '../contexts/Web3Context';
import { CHAINS } from '../constants/chains';

const HIGHLIGHTS = [
  {
    icon: <LowDollarIcon className="text-5xl dark:text-malibu text-cobalt" />,
    title: 'Low Transaction Fees',
    description: '0% fees for all collections utilizing HNY and 2% fees for all non-HNY collections'
  },
  {
    icon: <CheckedRibbonIcon className="text-5xl dark:text-malibu text-cobalt" />,
    title: 'High Quality Collections',
    description: 'Each collection on Hexagon is hand-vetted by our curation team to ensure quality'
  },
  {
    icon: <Icon icon="healthicons:money-bag-outline" className="text-5xl dark:text-malibu text-cobalt" />,
    title: 'Passive Income NFTs',
    description: 'No restrictions on trading passive income NFTs, unlike larger marketplace like OpenSea'
  }
];

export default function Home(props) {
  const { state: { appInit, chainId } } = useContext(Web3Context);
  const [featuredCollections, setCollections] = useState([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);

  const fetchData = useCallback(async function() {
    setIsCollectionLoading(true);
    const chain = CHAINS[chainId]?.name || 'polygon';
    const res = await fetch(collectionsUrl({ chain, size: 3, filter: 'featured' }));
    const collections = await res?.json();
    setCollections(collections?.results);
    setIsCollectionLoading(false);
  }, [chainId]);

  useEffect(() => {
    if (appInit) {
      fetchData();
    }
  }, [appInit, fetchData]);

  const { connect, address } = props;

  return !!appInit && (
    <>
      <div className="flex justify-center lg:max-w-6xl mx-auto">
        <div className="w-full">
          <div className="flex flex-col">
            <Hero address="0x19e46be2e3ad8968a6230c8fb140c4ccabc3ce0d" />
            <HeroCards connect={connect} address={address} />
          </div>
        </div>
      </div>

      <div className="absolute left-0 w-full dark:bg-lightGray/[0.1] bg-silver/[0.05]">
        <div className="flex justify-center lg:max-w-6xl mx-auto">
          <div className="w-full">
            <div className="flex flex-col">
              <section className="pt-12 pb-4 rounded-xl">
                <h2 className="text-center text-3xl font-semibold gradient-heading">Why Hexagon?</h2>
                <ul className="mt-10 flex flex-col md:flex-row justify-between">
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
            </div>
          </div>
        </div>
      </div>
            
      <div className="flex justify-center lg:max-w-6xl mx-auto mt-[750px] sm:mt-[660px] md:mt-[410px] mb-10">
        <div className="w-full">
          <div className="flex flex-col">
            <section>
              <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
              {
                isCollectionLoading
                  ? (
                    <div className="flex justify-center items-center h-24">
                      <Spinner className="w-[26px] dark:text-white text-ink" />
                    </div>
                  )
                  : !!featuredCollections && (
                    <>
                      {
                        featuredCollections.length > 0
                          ? (
                            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-8">
                                {featuredCollections?.map((collection, index) => (
                                  <li
                                    key={`${collection.address}_${index}`}
                                    className="mx-auto w-full h-full">
                                    <CollectionCard collection={collection} size="sml" />
                                  </li>
                                ))}
                            </ul>
                          )
                          : (
                            <div className="flex justify-center items-center h-24">
                              <p className="text-sm">No collections found in { CHAINS[chainId]?.label } network.</p>
                            </div>
                          )
                      }
                    </>
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
