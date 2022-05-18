import { useState, useCallback, useEffect, useContext } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { collectionsUrl } from "../constants/url";
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import { LowDollarIcon, CheckedRibbonIcon } from '../components/icons';
import Web3Context from '../contexts/Web3Context';
import { Icon } from '@iconify/react';
import FeaturedCollections from '../components/Home/FeaturedCollections';

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
    description: 'No restrictions on trading passive income NFTs, unlike larger marketplaces'
  }
];

export default function Home(props) {
  const { state: { appInit, chainId } } = useContext(Web3Context);
  const [featuredCollections, setCollections] = useState([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const heroCollectionAddress = '0x19e46be2e3ad8968a6230c8fb140c4ccabc3ce0d';

  const fetchData = useCallback(async function() {
    setIsCollectionLoading(true);
    const res = await fetch(collectionsUrl({ chain: 'polygon', size: 9 }));
    const collections = await res?.json();
    setCollections(collections?.results?.filter(({ address }) => address !== heroCollectionAddress));
    setIsCollectionLoading(false);
  }, []);

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
            <Hero address={heroCollectionAddress} />
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
                <ul className="mt-10 mx-8 md:mx-0 flex flex-col md:flex-row justify-between">
                  {
                    HIGHLIGHTS.map(({ icon, image, title, description }, index) => (
                      <li key={`highlight_${index}`} className={clsx(
                        'flex flex-col w-full border-[0.5px] border-transparent justify-between items-center mb-8 text-center md:mx-2 lg:mx-8 first:ml-0 last:mr-0'
                      )}>
                        { icon }
                        {
                          image && (
                            <Image
                              src={image}
                              alt={title}
                              className="text-cobalt"
                              width="48"
                              height="48"
                            />
                          )
                        }
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
            <FeaturedCollections isLoading={isCollectionLoading} featuredCollections={featuredCollections} />
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
