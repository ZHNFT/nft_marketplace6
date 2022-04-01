import { Fragment, useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import clsx from "clsx";
import { Tab } from '@headlessui/react'
import Link from 'next/link';
import { BeeIcon } from '../../../../components/icons';
import { resolveBunnyLink } from '../../../../Utils';
import { NFT_MODALS, NFT_LISTING_STATE } from '../../../../constants/nft';
import { usdFormatter, formatEther } from '../../../../Utils/helper';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../../../components/Buttons/SecondaryButton';
import SingleNftPageModal from '../../../../components/Modals/SingleNftPageModal';
import ProductPreview from '../../../../components/Product/ProductPreview';
import ProductDetailsHeader from '../../../../components/Product/ProductDetailsHeader';
import ProductDetails from '../../../../components/Product/ProductDetails';
import ProductCollection from '../../../../components/Product/ProductCollection';
import ProductBids from '../../../../components/Product/ProductBids';
import ProductOffers from '../../../../components/Product/ProductOffers';
import Activity from '../../../../components/Product/Activity';
import CollectionSlider from '../../../../components/Product/CollectionSlider';
import ItemPrice from '../../../../components/ItemPrice/ItemPrice';
import TraitsTable from '../../../../components/Product/TraitsTable';
import CountdownTimer from '../../../../components/CountdownTimer';
import fromUnixTime from 'date-fns/fromUnixTime'
import getUnixTime from 'date-fns/getUnixTime'

// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198
export default function Nft({ data: serverData, collection, nfts, chainIdHex, chainId, address, connect, ethersProvider, marketplaceContract, tokenContract, tokenBalance, tokenData }) {
  const [data, setData] = useState(serverData)

  // there can only be one active listing or auction for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can only be one active auction or listing for a token at the same time
  const activeAuction = data?.auctions?.find(auction => auction?.active);
  // there can be multiple active bids on a token at the same time, these are all bids on an item: listed, non-listed
  const activeBids = data?.bids?.filter(bid => bid?.active);
  // these are all bids on an item that are on auction
  const activeAuctionbids = activeAuction?.bids;

  // if item is on auction the owner in the data object is the marketplace address so we need to take the owner from the active auction instead
  const isOwner = activeAuction ? activeAuction.owner === address?.toLowerCase() : data?.owner === address?.toLowerCase() || false;
  const owner = activeAuction ? activeAuction?.owner : data?.owner;

  const marketplaceAddress = marketplaceContract?.address;

  const [activeModal, setActiveModal] = useState(null);

  const PRODUCT_TABS = [
    { id: 'properties', label: 'Properties', active: true },
    { id: 'offers', label: 'Offers', active: true }, // set active to true for testing
    { id: 'bids', label: 'Bids', active: true },  // set active to true for testing
    { id: 'collection', label: 'Collection', active: true },
    { id: 'details', label: 'Details', active: true }
  ];

  // refresh server side data
  const router = useRouter();
  const { address: contractAddress, id } = router.query;

  const fetchData = useCallback(async function() {
    const url = `https://hexagon-api.onrender.com/collections/${contractAddress}/token/${id}`;
    const res = await fetch(url)
    const data = await res?.json()

    setData(data);
  }, [contractAddress, id])

  const refreshMetaData = useCallback(async function() {
    const url = `https://hexagon-api.onrender.com/tokens/${data?._id}/refresh-metadata`;
    await fetch(
      url,
      {
        method: 'PUT',
      }
    )
  }, [data?._id])

  const handleModal = modal => address ? setActiveModal(modal) : connect();

  // For the owner of the NFT to accept a bid
  const handleAcceptBid = useCallback(async function (offer) {
    try {
      const tx = await marketplaceContract.AcceptBid({
        contractAddress: offer?.contractAddress || offer?.collectionId,
        userAddress: offer.userAddress,
        tokenId: offer.tokenId,
        pricePerItem: offer.pricePerItem.toString(),
        quantity: offer.quantity,
        expiry: offer.expiry,
        nonce: offer.nonce,
        r: offer.r,
        s: offer.s,
        v: offer.v,
      });
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
      if (txResult) {
        fetchData()
      }
    } catch (error) {
      alert(error?.data?.message || error?.message)
    }
  }, [marketplaceContract, fetchData])

  // For non-owners to cancel their bid
  const handleCancelBid = useCallback(async function (offer) {
    try {
      const tx = await marketplaceContract.CancelBid({
        contractAddress: offer?.contractAddress || offer?.collectionId,
        userAddress: offer.userAddress,
        tokenId: offer.tokenId,
        pricePerItem: offer.pricePerItem.toString(),
        quantity: offer.quantity,
        expiry: offer.expiry,
        nonce: offer.nonce,
        r: offer.r,
        s: offer.s,
        v: offer.v,
      });
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
      if (txResult) {
        fetchData()
      }
    } catch (error) {
      alert(error?.data?.message || error?.message)
    }
  }, [marketplaceContract, fetchData])

  // Conclude an auction, expects collectionAddress, tokenId and owner
  const handleConcludeAuction = useCallback(async function (auction) {
    try {
      const tx = await marketplaceContract.concludeAuction(
        auction?.collectionAddress || auction?.contractAddress || auction?.collectionId,
        auction?.tokenId,
        auction?.owner,
      );
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
      if (txResult) {
        fetchData()
      }
    } catch (error) {
      alert(error?.data?.message || error?.message)
    }
  }, [fetchData, marketplaceContract])

  const handleCloseModal = useCallback(function (){
    setActiveModal(null)
  }, [])

  useEffect(() => {
    setData(serverData);
  }, [serverData]);

  return (
    <div className='dark:bg-[#202225] dark:text-white'>
      <SingleNftPageModal
        isOpen={activeModal !== null}
        onClose={handleCloseModal}
        activeModal={activeModal}
        marketplaceAddress={marketplaceAddress}
        marketplaceContract={marketplaceContract}
        address={address}
        tokenContract={tokenContract}
        chainId={chainId}
        ethersProvider={ethersProvider}
        tokenId={data?.tokenId}
        collectionId={data?.collectionId}
        name={data?.name}
        owner={owner}
        imageUrl={resolveBunnyLink(data?.imageHosted)}
        fetchData={fetchData}
        activeListing={{ ...activeListing, highestBid: data?.highestBid }}
        activeAuction={activeAuction}
        tokenPriceUsd={tokenData?.priceUsd}
        tokenBalance={tokenBalance}
      />
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-8 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product Image/Preview */}
          <ProductPreview
            className="lg:col-span-4 lg:max-w-[472px]"
            name={data?.name}
            image={data?.imageHosted}
            expiry={activeAuction?.expiry || activeListing?.expiry}
            listingState={(() => {
              if (activeAuction) return NFT_LISTING_STATE.IN_AUCTION;
              if (activeListing) return NFT_LISTING_STATE.FOR_SALE;
              return NFT_LISTING_STATE.NOT_LISTED;
            })()}
          />

          {/* Product Details Header */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:col-span-4 w-full">
            <ProductDetailsHeader
              collection={{ name: collection?.name, logo: collection?.logo, address: collection?.address }}
              name={data?.name}
              owner={owner}
              isOwner={isOwner}
              address={address}
              lastSalePrice={data?.lastSalePrice}
              rarity={data?.rarity}
              maxRarity={collection?.rarity?.highest}
              refreshMetaData={refreshMetaData}
            />

            <div className={clsx(
              'min-h-[80px] border-[0.5px] rounded-xl mt-4 flex py-2 px-4 text-xs items-center',
              !activeListing && !activeAuction ? 'border-manatee' : 'border-cornflower'
            )}>
              {isOwner ? (<>
                { // Owner & not listed
                  !activeListing && !activeAuction && (
                    <>
                      <p className="text-manatee font-medium">This item is not currently listed</p>
                      <div className="ml-auto">
                        <SecondaryButton
                          className="border-cornflower min-w-[98px] text-ink dark:text-white"
                          onClick={() => handleModal(NFT_MODALS.LIST)}
                        >
                          List item
                        </SecondaryButton>
                      </div>
                    </>
                  )
                }

                { // Owner & for sale
                  activeListing && (
                    <>
                      <div>
                        <p className="mb-1">
                          <span className="text-xs text-manatee mr-2.5 font-medium">Price</span>
                          <button
                            type="button"
                            className="font-light text-xs text-cornflower"
                            onClick={() => handleModal(NFT_MODALS.CHANGE_PRICE)}
                          >
                            Change
                          </button>
                        </p>
                        <div className="flex items-baseline relative">
                          <BeeIcon className="absolute w-[28px] -left-[4px] -top-[3px]" />
                          <span className="text-base font-medium ml-6">{formatEther(activeListing?.pricePerItem)}</span>
                          <span className="text-xs text-manatee ml-2">{usdFormatter.format(Number(formatEther(activeListing?.pricePerItem)) * Number(tokenData?.priceUsd))}</span>
                        </div>
                      </div>
                      <div className="ml-auto items-center flex">
                        <button
                          type="button"
                          className="font-light text-xs text-cornflower mr-4"
                          onClick={() => handleModal(NFT_MODALS.UNLIST)}
                        >
                          Remove listing
                        </button>
                      </div>
                    </>
                  )
                }

                { // Owner & in auction
                  activeAuction && (
                    <div className='flex items-center justify-between w-full'>
                      <div>
                        {activeAuction?.highestBid ? (
                          <div>
                            <p className="mb-1">
                              <span className="text-xs text-manatee mr-2.5 font-medium">Current bid</span>
                            </p>
                            <div className="flex items-baseline relative">
                              <BeeIcon className="absolute w-[28px] -left-[4px] -top-[3px]" />
                              <span className="text-base font-medium ml-6">{formatEther(activeAuction?.highestBid)}</span>
                              <span className="text-xs text-manatee ml-2">{usdFormatter.format(Number(formatEther(activeAuction?.highestBid)) * Number(tokenData?.priceUsd))}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-manatee">No bids yet</p>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span>Time remaining</span>
                        <CountdownTimer
                          date={fromUnixTime(activeAuction?.expiry)}
                        />
                      </div>
                      <div>
                        {getUnixTime(new Date()) >= activeAuction?.expiry ? (
                          <PrimaryButton className="mr-4 !px-4" size="sm" onClick={() => handleConcludeAuction(activeAuction)}>
                            Conclude auction
                          </PrimaryButton>
                        ) : null}
                      </div>
                    </div>
                  )
                }
              </>)
                : (<>
                  { // Not owner & not listed
                    !activeListing && !activeAuction && (
                      <>
                        <p className="text-manatee font-medium">This item is not currently listed</p>
                        <div className="ml-auto">
                          <SecondaryButton
                            className="border-manatee text-ink dark:text-white"
                            onClick={() => handleModal(NFT_MODALS.MAKE_OFFER)}
                          >
                            Make offer
                          </SecondaryButton>
                          {
                            !!data?.highestBid && (
                              <p className="text-center text-xxs relative h-[12px]"><ItemPrice label="Highest" value={data?.highestBid} /></p>
                            )
                          }
                        </div>
                      </>
                    )
                  }

                  { // Not owner & for sale
                    activeListing && (
                      <>
                        <div>
                          <p className="mb-1">
                            <span className="text-xs text-manatee mr-2.5 font-medium">Price</span>
                          </p>
                          <div className="flex items-baseline relative">
                            <BeeIcon className="absolute w-[28px] -left-[4px] -top-[3px]" />
                            <span className="text-base font-medium ml-6">{formatEther(activeListing?.pricePerItem)}</span>
                            <span className="text-xs text-manatee ml-2">{usdFormatter.format(Number(formatEther(activeListing?.pricePerItem)) * Number(tokenData?.priceUsd))}</span>
                          </div>
                        </div>
                        <div className="ml-auto flex">
                          <PrimaryButton className="mr-4 !px-4" size="sm" onClick={() => handleModal(NFT_MODALS.BUY_NOW)}>
                            Buy now
                          </PrimaryButton>
                          <div className="flex relative">
                            <SecondaryButton
                              className="border-manatee text-ink dark:text-white"
                              onClick={() => handleModal(NFT_MODALS.MAKE_OFFER)}
                            >
                              Make offer
                            </SecondaryButton>
                            {
                              !!data?.highestBid && (
                                <p className="text-center absolute left-0 right-0 -bottom-[12px] text-xxs h-[12px]">
                                  <ItemPrice label="Highest" value={data?.highestBid} />
                                </p>
                              )
                            }
                          </div>
                        </div>
                      </>
                    )
                  }

                  { // Not owner & in auction
                    activeAuction && (
                      <div className='flex items-center justify-between w-full'>
                        <div>
                          {activeAuction?.highestBid ? (
                            <div>
                              <p className="mb-1">
                                <span className="text-xs text-manatee mr-2.5 font-medium">Current bid</span>
                              </p>
                              <div className="flex items-baseline relative">
                                <BeeIcon className="absolute w-[28px] -left-[4px] -top-[3px]" />
                                <span className="text-base font-medium ml-6">{formatEther(activeAuction?.highestBid)}</span>
                                <span className="text-xs text-manatee ml-2">{usdFormatter.format(Number(formatEther(activeAuction?.highestBid)) * Number(tokenData?.priceUsd))}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-manatee">No bids yet</p>
                          )}
                        </div>
                        <div className='flex flex-col'>
                          {!(getUnixTime(new Date()) >= activeAuction?.expiry) ? (
                            <span>Time remaining</span>
                          ) : null}
                          <CountdownTimer
                            date={fromUnixTime(activeAuction?.expiry)}
                          />
                        </div>
                        <div>
                          {!(getUnixTime(new Date()) >= activeAuction?.expiry) ? (
                            <PrimaryButton className="mr-4 !px-4" size="sm" onClick={() => handleModal(NFT_MODALS.PLACE_BID)}>
                              Place Bid
                            </PrimaryButton>
                          ) : null}
                          {getUnixTime(new Date()) >= activeAuction?.expiry && activeAuction?.highestBidder === address?.toLowerCase() ? (
                            <PrimaryButton className="mr-4 !px-4" size="sm" onClick={() => handleConcludeAuction(activeAuction)}>
                              Conclude auction
                            </PrimaryButton>
                          ) : null}
                        </div>
                      </div>
                    )
                  }
                </>)
              }
            </div>

            <Tab.Group as="div">
              <div className="mt-4">
                <Tab.List className="-mb-px flex items-center justify-between space-x-8 shadow-tab rounded-tab h-[38px]" style={{ background: 'linear-gradient(161.6deg, #1E2024 -76.8%, #2A2F37 104.4%)' }}>
                  {
                    PRODUCT_TABS.filter(tab => tab.active).map(({ id, label }) => (
                      <Tab
                        key={id}
                        className={({ selected }) =>
                          clsx(
                            selected
                              ? 'bg-tabButton shadow-tabButton rounded-tab'
                              : 'text-[#969EAB] hover:text-white',
                            'whitespace-nowrap font-medium text-xs w-[115px] h-[34px]'
                          )
                        }
                      >
                        {label}
                      </Tab>
                    ))
                  }
                </Tab.List>
              </div>
              <Tab.Panels as={Fragment}>

                {/* Properties tab */}
                <Tab.Panel as="dl">
                  <TraitsTable traits={data?.traits} />
                </Tab.Panel>

                {/* Offers tab */}
                <Tab.Panel className="pt-7" as="dl">
                  <ProductOffers
                    offers={activeBids}
                    tokenPriceUsd={tokenData?.priceUsd}
                    onCancelBid={handleCancelBid}
                    onAcceptBid={handleAcceptBid}
                    currentUser={address}
                    isOwner={isOwner}
                  />
                </Tab.Panel>

                {/* Bids tab */}
                <Tab.Panel className="pt-7" as="dl">
                  <ProductBids
                    bids={activeAuctionbids}
                    currentUser={address}
                    isOwner={isOwner}
                    tokenPriceUsd={tokenData?.priceUsd}
                  />
                </Tab.Panel>

                {/* Collection tab */}
                <Tab.Panel className="pt-7" as="dl">
                  <ProductCollection
                    collectionId={data?.collectionId}
                    itemCount={collection?.totalSupply}
                    ownerCount={collection?.ownerCount}
                    volume={formatEther(collection?.volume?.total)}
                    floorPrice={formatEther(collection?.floorPrice)}
                    instagram="#"
                    twitter="#"
                    website="#"
                  />
                </Tab.Panel>

                {/* Details tab */}
                <Tab.Panel className="pt-7" as="dl">
                  <ProductDetails
                    description={data?.metadata?.description}
                    address={data?.collectionId}
                    tokenId={data?.tokenId}
                    tokenStandard={data?.contractType}
                    blockchain={data?.blockchain}
                    chain={collection?.chain}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        <h2 className="mt-12 mb-4">Activity</h2>
        <Activity
          tokenPriceUsd={tokenData?.priceUsd}
        />

        <div className="mt-12 flex justify-between items-center">
          <h2>More from this collection</h2>
          <Link href={`/collections/${data?.collectionId}`} passHref>
            <a className="text-xs text-cornflower hover:underline ml-1">
              View collection
            </a>
          </Link>
        </div>
        <CollectionSlider items={nfts} />
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { params: { address, id } } = context;
  const url = `https://hexagon-api.onrender.com/collections/${address}/token/${id}`;
  const collectionUrl = `https://hexagon-api.onrender.com/collections/${address}`;
  const tokensUrl = `https://hexagon-api.onrender.com/collections/${address}/tokens?page=0&sort=tokenId&size=9`;
  const [res, collectionRes, nftsRes] = await Promise.all([fetch(url), fetch(collectionUrl), fetch(tokensUrl, { method: 'POST' })]);
  let data = await res?.json();
  const collection = await collectionRes?.json();
  const nfts = await nftsRes?.json();
  const bidsUrls = `https://hexagon-api.onrender.com/bids/validate-balance?chain=mumbai`;
  const bids = data?.bids?.map((bid) => bid?._id);
  if (bids && bids?.length) {
    const bidsRes = await fetch(bidsUrls, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bids }),
    });
    const bidsData = await bidsRes?.json();
    if (bidsData && bidsData?.length) {
      data = { ...data, bids: bidsData };
    }
  }

  return {
    props: {
      data,
      collection,
      nfts: nfts?.results?.filter(result => result?.tokenId?.toString() !== id) // exclude current NFT from "more collections"
    }
  };
}