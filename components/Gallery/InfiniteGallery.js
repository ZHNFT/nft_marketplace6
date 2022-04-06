import { useState, useMemo, useCallback, useEffect } from 'react';
import useInView from "react-cool-inview";
import { useRouter } from 'next/router'
import clsx from 'clsx';
import GalleryItem from './GalleryItem';
import { transformGalleryItem } from '../../Utils/helper'
import { fetchData } from '../../pages/collections/[address]' 

export default function InfiniteGallery({ className, collectionData }) {
  const { pathname, query, asPath } = useRouter();
  const { search, address, sort, tab, filter, priceFrom, priceTo, rarityFrom, rarityTo } = query;
  const [data, setData] = useState(collectionData);
  const [results, setResults] = useState(data?.results);
  const endpoint = pathname.replace(/\[.*?\]\s?/g, address);
  const hasMore = data?.nextPage ? true : false;
  const [loading, setLoading] = useState(false)

  const method = pathname.includes("users") ? "GET" : "POST";

  const fetchCollection = useCallback(async function() {
    const json = await fetchData({ asPath, page: data?.nextPage, search, filter, sort, priceFrom, priceTo, rarityFrom, rarityTo, method });
    setData(json);
    setResults(prevState => [...prevState, ...json?.results]);
    setLoading(false)
  }, [asPath, search, sort, data?.nextPage, method, filter, priceFrom, priceTo, rarityFrom, rarityTo]);

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
    <div className={clsx(
      'grid justify-center gap-y-2 gap-x-2 sm:gap-x-8 mx-auto max-w-[390px] sm:max-w-none',
      className
    )}>
      {
        results?.map((item, index) => (
          <GalleryItem
            ref={index === results.length - 1 ? observe : null}
            key={index}
            item={transformGalleryItem(item)}
            showRarity={true}
          />
        ))
      }
       <div>{loading && 'Loading...'}</div>
    </div>
  );
}