import { useState, useCallback, useEffect } from 'react';
import { getCollectionsWithTokenSnippets } from '../Utils/helper';
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import CollectionCard from '../components/Collection/CollectionCard';
import Spinner from '../components/Spinner/Spinner';

export default function Home(props) {
  const [featuredCollections, setCollections] = useState([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);

  const fetchData = useCallback(async function() {
    setIsCollectionLoading(true);
    const chain = process.env.NEXT_PUBLIC_CHAIN;
    const collectionsWithTokens = await getCollectionsWithTokenSnippets({ chain, size: 2 });
    setCollections(collectionsWithTokens);
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
    <div className="flex justify-center lg:max-w-6xl mx-auto">

      <div>
        <div className="flex flex-col">
          <Hero />
          <HeroCards connect={connect} address={address} />

          <section className="mt-14 mb-10">
            <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
            {
              isCollectionLoading
                ? (
                  <div className="flex justify-center items-center h-24">
                    <Spinner className="w-[26px] text-white" />
                  </div>
                )
                : (
                  <ul role="list" className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                      {featuredCollections?.map((collection, index) => (
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
  )
}

export async function getStaticProps() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const url = `https://api.hexag0n.io/collections?page=0&size=2&chain=${chain}`;
  const res = await fetch(url)
  const data = await res?.json()
  return { props: { collections: data }, revalidate: 30 };
}
