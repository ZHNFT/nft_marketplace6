import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWRImmutable from 'swr';
import { fromUnixTime, format } from 'date-fns';
import { resolveBunnyLink } from '../../Utils';
import NotFoundImage from '../../images/No-Image-Placeholder.png';
import { collectionUrl, nftUrl } from '../../constants/url';
import { fetcher, getListingState } from '../../Utils/helper';
import { NFT_LISTING_STATE } from '../../constants/nft';
import { LISTING_END_DATE_FORMAT } from '../../constants/dates';
import { TogaIcon, ViewIcon, AuctionIcon } from '../icons';
import DefaultLogo from '../../images/default-collection-logo.png';
import PrimaryButton from '../Buttons/PrimaryButton';

export default function Hero() {
  // featured NFT
  const address = '0x19e46be2e3ad8968a6230c8fb140c4ccabc3ce0d';
  const id = '1';
  const { data: collection } = useSWRImmutable(collectionUrl({ address }), fetcher);
  const { data: nft } = useSWRImmutable(nftUrl({ address, id }), fetcher);
  const { name, imageHosted, listings, auctions } = nft || {};
  const [listingState, setListingState] = useState();
  const [expiry, setExpiry] = useState();

  useEffect(() => {
    const { state, expiry } = getListingState({ listings, auctions });
    setListingState(state);
    setExpiry(expiry)
  }, [listings, auctions]);
  
  return (
    <div className="flex flex-col lg:flex-row mt-12 mb-10 items-center">
      <div className="md:mr-12 lg:mr-24 mb-8 lg:mb-0 text-center lg:text-left">
        <h1 className="text-4xl md:text-6xl font-medium gradient-heading leading-normal mb-6 py-[10px]">
          Welcome to Hexagon
        </h1>
        <div className="mb-10 lg:max-w-sm">
          <p className="text-manatee text-xs">
            Polygon's Premier NFT Marketplace
          </p>
        </div>
        <span className="block mb-4">
          <Link href="/collections/0x19e46be2e3ad8968a6230c8fb140c4ccabc3ce0d">
            <a className="gradient-bg-blue rounded-[10px] text-xs text-white px-10 py-2.5 border-[0.5px] border-transparent hover:border-white">
              Explore
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
                <Image className="h-8 w-8" src={collection?.images?.logo || DefaultLogo} alt={name} width={"100%"} height={"100%"} />
              </span>
              <span className="text-white text-xs hover:underline">{collection?.name}</span>
            </a>
          </Link>
          <span className="text-sm mr-1">{name}</span>
        </div>
        <div className="flex relative">
          <Link href={`/collections/${address}/token/${id}`} passHref>
            <a className="hero-image w-full max-w-[439px] h-[439px] aspect-w-4 aspect-h-4 rounded-xl bg-gray-100 overflow-hidden">
              {
                collection && nft && (
                  <>
                    {imageHosted ? (
                      <Image
                      src={`${resolveBunnyLink(imageHosted)}?optimizer=image&width=944&aspect_ratio=1:1`}
                      alt={name}
                      className="object-center object-cover"
                      layout="fill" 
                    /> 
                    ) : (
                      <Image
                        src={NotFoundImage}
                        alt={name}
                        className="object-center object-cover"
                        layout="fill" 
                      /> 
                    )}
                  </>
                )
              }
            </a>
          </Link>
          {/*
          <div className="flex absolute z-10 bottom-0 left-0 right-0 bg-shadow rounded-md text-xs py-4 px-4 text-white items-center justify-between">
            { 
              listingState === NFT_LISTING_STATE.IN_AUCTION && (
                <>
                  <div>
                    <p>No bids yet</p>
                  </div>
                  
                  <div>
                    <PrimaryButton className="!px-4" size="sm">
                      Place Bid
                    </PrimaryButton>
                  </div>
                  
                </>
              )
            }
          </div>
          */}

        
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
  );
}