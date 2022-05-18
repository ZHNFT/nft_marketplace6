import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveBunnyLink } from '../../Utils';
import CollectionCard from '../Collection/CollectionCard';
import { collectionUrl } from '../../constants/url';
import HiveImage from "../../images/collection-card-image-hive.png";
import DefaultLogo from '../../images/default-collection-logo.png';
import HiveLogo from "../../images/collection-card-logo-hive.png";
import Spinner from '../Spinner/Spinner';

const getLogoUrl = logo => (
  logo && logo.startsWith('ipfs:') ? `${resolveBunnyLink(logo)}?optimizer=image&width=76&aspect_ratio=1:1` : logo
);

export default function Hero({ address }) {
  const [collection, setCollection] = useState();

  const fetchData = useCallback(async function() {
    const collectionResponse = await fetch(collectionUrl({ address }));
    const collectionData = await collectionResponse?.json();
    setCollection(collectionData);
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return (
    <>
      <div className="w-full h-[700px] absolute top-[56px] lg:top-[62px] left-0">
        <Image
          className="block w-full object-center object-cover opacity-50 blur light-mask"
          src={HiveImage}
          alt="Hive Investments"
          layout="fill" 
        />
      </div>
      <div className="relative flex flex-col lg:flex-row lg:mt-12 mb-10 items-center">
        <div className="md:mr-12 lg:mr-22 mb-8 lg:mb-0 text-center lg:text-left">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium gradient-heading leading-normal lg:leading-tight mb-6 py-[10px]">
            Welcome to Polygon&apos;s Premier NFT Marketplace
          </h1>
          <div className="mb-10 lg:max-w-xl">
            <p className="dark:text-manatee font-light text-gunmetal text-md md:text-lg">
              Hexagon lets you explore, collect, and trade hand-vetted collections across Polygon
            </p>
          </div>
          <span className="block mb-4">
            <Link href="/collections">
              <a className="gradient-bg-blue rounded-[10px] text-sm md:text-md text-white px-10 py-2.5 border-[0.5px] border-transparent hover:contrast-150">
                Discover
              </a>
            </Link>

            {
              // <Link href="#">
              //   <a className="text-xs hover:underline ml-8">
              //     Learn more
              //     <TogaIcon className="text-white w-[16px] ml-2.5" />
              //   </a>
              // </Link>
            }
          </span>
        </div>
        
        <div className="flex flex-col w-full max-w-[439px]">
          <div className="flex justify-between mb-2">
            <Link href={`/collections/${address}`} passHref>
              <a className="flex items-center cursor-pointer">
                <span className="inline-block rounded-full overflow-hidden w-[26px] h-[26px]  mr-1.5">
                  { collection && <Image className="h-8 w-8" src={HiveLogo} alt={collection?.name} width={"100%"} height={"100%"} /> }
                </span>
                <span className="dark:text-white text-ink text-xs hover:underline">{collection?.name}</span>
              </a>
            </Link>
            {/*<span className="text-sm mr-1">{name}</span>*/}
          </div>
          <div className="relative max-w-[439px]">
            { collection 
                ? <CollectionCard collection={collection} size="sml" hideDescription />
                : (
                  <div className="flex h-[420px] justify-center items-center h-24">
                    <Spinner className="w-[26px] dark:text-white text-ink" />
                  </div>
                )
            }
          </div>


          {/* <div className="flex justify-between items-center mt-2">
            <div className="flex text-xxs">
              <span className="rounded-xl dark:bg-white/[0.05] bg-black/[0.05] py-1 px-3">Utility</span>
              
            </div>
            {
              expiry && (
                <div className="text-xs text-manatee ml-2 text-right">
                  { listingState === NFT_LISTING_STATE.IN_AUCTION && <AuctionIcon className="w-[14px] mr-2 relative -top-[1px]" /> }
                  { `Ends ${format(fromUnixTime(expiry), LISTING_END_DATE_FORMAT)} UTC` }
                </div>
              )
            } 
          </div> */}
        </div>
      </div>
    </>
  );
}