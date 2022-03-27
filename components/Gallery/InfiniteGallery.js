import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import useInView from "react-cool-inview";
import { useRouter } from 'next/router'
import GalleryContext from '../../contexts/GalleryContext';
import { NFT_MODALS } from '../../constants/nft';
import GalleryItem from './GalleryItem';
import { transformGalleryItem } from '../../Utils/helper'
import { fetchData } from '../../pages/collections/[address]' 

export default function InfiniteGallery({ collectionData }) {
  const { pathname, query } = useRouter();
  const { search, address, sort, tab } = query;
  const [data, setData] = useState(collectionData);
  const [results, setResults] = useState(data?.results);
  const endpoint = pathname.replace(/\[.*?\]\s?/g, address);
  const hasMore = data?.nextPage ? true : false;
  const [loading, setLoading] = useState(false)
  const defaultActiveModal = { type: '' };
  const [activeModal, setActiveModal] = useState(defaultActiveModal);
  const value = useMemo(
    () => ({ activeModal, setActiveModal }), 
    [activeModal]
  );
  const fetchCollection = useCallback(async function() {
    const json = await fetchData(address, data?.nextPage, search, sort);
    setData(json);
    setResults(prevState => [...prevState, ...json?.results]);
    setLoading(false)
  }, [address, search, sort, data?.nextPage]);

  // https://github.com/wellyshen/react-cool-inview
  const { observe, unobserve } = useInView({
    // rootMargin: "50px 0px",
    onEnter: () => {
      if (!hasMore) {
        unobserve();
        return;
      }
      setLoading(true)
      fetchCollection();
    },
  });

  useEffect(() => {
    setData(collectionData);
  }, [collectionData]);

  useEffect(() => {
    if (data?.page === 0) {
      // refresh results when filters get updated
      setResults(data?.results);
    }
  }, [data?.page, data?.results]);

  return (
    <GalleryContext.Provider value={value}>
      <div className="grid justify-center sm:grid-cols-2 sm:justify-between md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-2 gap-x-5 mx-auto">
        {
          results?.map((item, index) => (
            <GalleryItem ref={index === results.length - 1 ? observe : null} key={index} item={transformGalleryItem(item)} />
          ))
        }
         <div>{loading && 'Loading...'}</div>
      </div>
    </GalleryContext.Provider>
  );
}