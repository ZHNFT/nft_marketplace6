import { useState, useCallback, useEffect, useContext } from 'react';
import { collectionsUrl } from "../constants/url";
import CollectionCard from '../components/Collection/CollectionCard';
import Spinner from '../components/Spinner/Spinner';
import { PaintIcon, StackedPaperIcon, HeadphoneIcon, CameraIcon, WheelIcon, WalletIcon } from '../components/icons';
import Web3Context from '../contexts/Web3Context';
import { CHAINS } from '../constants/chains';

const categories = [
  {
    name: 'Art',
    icon: () => <PaintIcon className="w-[18px]" />
  },
  {
    name: 'Collectibles',
    icon: () => <StackedPaperIcon className="w-[18px]" />
  },
  {
    name: 'Music',
    icon: () => <HeadphoneIcon className="w-[18px]" />
  },
  {
    name: 'Photography',
    icon: () => <CameraIcon className="w-[18px]" />
  },
  {
    name: 'Sport',
    icon: () => <WheelIcon className="w-[18px]" />
  },
  {
    name: 'Utility',
    icon: () => <WalletIcon className="w-[18px]" />
  }
];

export default function Collections() {
  const { state: { appInit, chainId } } = useContext(Web3Context);
  const [collections, setCollections] = useState([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [categoryButtons, setCategoryButtons] = useState({});

  const fetchData = useCallback(async function() {
    setIsCollectionLoading(true);
    const chain = CHAINS[chainId]?.name || 'polygon';
    const selectedCategories = Object.keys(categoryButtons).filter(key => !!categoryButtons[key]);
    const res = await fetch(collectionsUrl({ chain, sort: 'createdAt', categories: selectedCategories }));
    const collections = await res?.json();
    setCollections(collections?.results);
    setIsCollectionLoading(false);
  }, [categoryButtons, chainId]);

  useEffect(() => {
    if (appInit) {
      fetchData();
    }
  }, [appInit, fetchData]);

  return !!appInit && (
    <div className="flex justify-center lg:max-w-6xl mx-auto">
      <div className="w-full">
        <div className="flex flex-col">
          <section className="lg:mt-4 mb-10 w-full">
            {/*<div className="flex flex-wrap justify-between mb-4 -mx-2">
              {
                categories.map(({ name, icon }) => {
                  const value = name.toLowerCase();
                  return (
                    <button
                      key={`category_${name}`}
                      className={clsx(
                        'bg-contain bg-buttonOutline hover:bg-buttonOutlineHover w-[120px] h-[36px] lg:w-[170px] lg:h-[50px] transition-all duration-200 relative top-0 lg:hover:-top-[4px] mb-6 mx-2',
                        { 'bg-buttonOutlineHover lg:-top-[4px]': !!categoryButtons[value] }
                      )}
                      onClick={() => setCategoryButtons({...categoryButtons, [value]: !categoryButtons[value] })}
                    >
                      <span className="flex justify-center items-center">
                        <span className="text-xs lg:text-sm mr-2">{ name }</span>
                        { icon() }
                      </span>
                    </button>
                  );
                })
              }
            </div>*/}

            {
              isCollectionLoading
                ? (
                  <div className="flex justify-center items-center h-[380px]">
                    <Spinner className="w-[26px] dark:text-white text-ink" />
                  </div>
                )
                : !!collections && (
                  <>
                    {
                      collections.length > 0
                        ? (
                          <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                              {collections.map((collection, index) => (
                                <li
                                  key={`${collection.address}_${index}`}
                                  className="mx-auto w-full">
                                  <CollectionCard collection={collection} />
                                </li>
                              ))}
                          </ul>
                        )
                        : (
                          <div className="flex justify-center items-center h-[380px]">
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
  )
}

export async function getStaticProps() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const url = `https://api.hexag0n.io/collections?page=0&size=50&sort=name&chain=${chain}`;
  const res = await fetch(url)
  const data = await res?.json()
  return { props: { data }, revalidate: 30 };
}
