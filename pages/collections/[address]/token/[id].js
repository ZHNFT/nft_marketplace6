import { Fragment, useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { ethers } from "ethers";
import clsx from "clsx";
import { Tab } from '@headlessui/react'
import Link from 'next/link';
import { BeeIcon } from '../../../../components/icons';
import { resolveBunnyLink } from '../../../../Utils';
import { NFT_MODALS, NFT_LISTING_STATE } from '../../../../constants/nft';
import { convertToUsd } from '../../../../Utils/helper';
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

// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198
export default function Nft({ data: serverData, nfts, chainIdHex, chainId, address, connect, ethersProvider, marketplaceContract, tokenContract, tokenBalance }) {
  const [data, setData] = useState(serverData)
  const isOwner = data?.owner === address?.toLowerCase() || false;
  // there can only be one active listing or auction for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can only be one active auction or listing for a token at the same time
  const activeAuction = data?.auctions?.find(auction => auction?.active);
  // there can be multiple active bids on a token at the same time, these are all bids on an item: listed, non-listed
  const activeBids = data?.bids?.filter(bid => bid?.active);
  // these are all bids on an item that are on auction
  const activeAuctionbids = activeAuction?.bids;

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

  const fetchData = useCallback(async function () {
    const url = `https://hexagon-api.onrender.com/collections/${contractAddress}/token/${id}`;
    const res = await fetch(url)
    const data = await res?.json()
    setData(data);
  }, [contractAddress, id])

  const handleModal = modal => address ? setActiveModal(modal) : connect();

  // For the owner of the NFT to accept a bid
  const handleAcceptBid = useCallback(async function (offer) {
    try {
      const tx = await marketplaceContract.AcceptBid({
        contractAddress: offer?.contractAddress || offer?.collectionId,
        userAddress: offer.userAddress,
        tokenId: offer.tokenId,
        pricePerItem: offer.pricePerItem,
        quantity: offer.quantity,
        expiry: offer.expiry,
        nonce: offer.nonce,
        r: offer.r,
        s: offer.s,
        v: offer.v,
      });
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
    } catch (error) {
      alert(error?.message)
    }
  }, [marketplaceContract])

  // For non-owners to cancel their bid
  const handleCancelBid = useCallback(async function (offer) {
    try {
      const tx = await marketplaceContract.CancelBid({
        contractAddress: offer?.contractAddress || offer?.collectionId,
        userAddress: offer.userAddress,
        tokenId: offer.tokenId,
        pricePerItem: offer.pricePerItem,
        quantity: offer.quantity,
        expiry: offer.expiry,
        nonce: offer.nonce,
        r: offer.r,
        s: offer.s,
        v: offer.v,
      });
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
    } catch (error) {
      alert(error?.message)
    }
  }, [marketplaceContract])

  const handleCloseModal = useCallback(function (){
    setActiveModal(null)
  }, [])

  console.log(`data`, data)

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
        owner={data?.owner}
        imageUrl={resolveBunnyLink(data?.imageHosted)}
        fetchData={fetchData}
        activeListing={activeListing}
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
              name={data?.name}
              owner={data?.owner}
              isOwner={isOwner}
              address={address}
              lastSalePrice={38.7}
              rarityRank={data?.rarityRank}
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
                        {
                          !!data?.highestBid && (
                            <SecondaryButton
                              className="border-manatee mr-4 text-ink dark:text-white"
                              onClick={() => console.log('view offers')}
                            >
                              View offers
                            </SecondaryButton>
                          )
                        }
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
                          <span className="text-base font-medium ml-6">{activeListing.pricePerItem / 1000000000}</span>
                          <span className="text-xs text-manatee ml-2">$ {convertToUsd({ value: activeListing.pricePerItem })}</span>
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
                        {
                          data?.highestBid
                            ? (
                              <SecondaryButton
                                className="border-manatee text-ink dark:text-white"
                                onClick={() => console.log('view offers')}
                              >
                                View offers
                              </SecondaryButton>
                            )
                            : <p className="text-manatee">No offers</p>
                        }
                      </div>
                    </>
                  )
                }

                { // Owner & in auction
                  activeAuction && (
                    <>
                      <div>
                        <p className="text-xs text-manatee">No bids yet</p>
                      </div>
                    </>
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
                              <p className="text-center text-xxs relative h-[12px]"><ItemPrice label="Highest" value={ethers.utils.formatEther(ethers.BigNumber.from(data?.highestBid.toString()))} /></p>
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
                            <span className="text-base font-medium ml-6">{activeListing.pricePerItem / 1000000000}</span>
                            <span className="text-xs text-manatee ml-2">$ {convertToUsd({ value: activeListing.pricePerItem })}</span>
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
                                  <ItemPrice label="Highest" value={data?.highestBid / 1000000000} />
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
                      <>
                        <div>
                          <p className="text-xs text-manatee">No bids yet</p>
                        </div>
                        <div>
                          <PrimaryButton className="mr-4 !px-4" size="sm" onClick={() => handleModal(NFT_MODALS.PLACE_BID)}>
                            Place Bid
                          </PrimaryButton>
                        </div>
                      </>
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
                    //offers={activeBids}
                    offers={[
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '2 days' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '2 days' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '2 days' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '2 days' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '2 days' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '2 days' }
                    ]}
                    onCancelOffer={() => console.log('cancel offer')}
                    onAcceptOffer={() => console.log('accept offer')}
                  />
                </Tab.Panel>

                {/* Bids tab */}
                <Tab.Panel className="pt-7" as="dl">
                  <ProductBids
                    bids={activeBids}
                    currentUser={address}
                    isOwner={isOwner}
                    /*bids={[
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '23 minutes ago' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '23 minutes ago' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '23 minutes ago' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '23 minutes ago' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '23 minutes ago' },
                      { '_id': 1, pricePerItem: 122, userAddress: '0x43dkjfdkfjkb928', expiry: '23 minutes ago' }
                    ]}*/
                    onCancelBid={handleCancelBid}
                    onAcceptBid={handleAcceptBid}
                  />
                </Tab.Panel>

                { /*
                <Tab.Panel as="dl" className="text-sm text-gray-500">
                  {activeBids?.map((bid) => (
                    <Fragment key={bid._id}>
                      <dt className="mt-10 font-medium text-gray-900">{bid.expiry}</dt>
                      <dd className="mt-2 prose prose-sm max-w-none text-gray-500">
                        <p>{bid.pricePerItem}</p>
                      </dd>
                      {bid?.userAddress === address && (
                        <button
                          type="button"
                          className='mt-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-full'
                          onClick={() => handleCancelBid(bid)}
                        >
                          Cancel Bid
                        </button>
                      )}
                      {isOwner && (
                          <button
                          type="button"
                          className='mt-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-full'
                          onClick={() => handleAcceptBid(bid)}
                        >
                          Accept Bid
                        </button>
                      )}
                    </Fragment>
                  ))}
                </Tab.Panel>
                */ }

                {/* Collection tab */}
                <Tab.Panel className="pt-7" as="dl">
                  <ProductCollection
                    collectionId={data?.collectionId}
                    itemCount="48K"
                    ownerCount="36.1K"
                    volume="16.7K"
                    floorPrice="23"
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
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        <h2 className="mt-12 mb-4">Activity</h2>
        <Activity />

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
  const collectionUrl = `https://hexagon-api.onrender.com/collections/${address}/tokens?page=0&sort=tokenId&size=9`;
  const [res, nftsRes] = await Promise.all([fetch(url), fetch(collectionUrl, { method: 'POST' })]);
  const data = await res?.json();
  const nfts = await nftsRes?.json();

  return {
    props: {
      data,
      nfts: nfts?.results?.filter(result => result?.tokenId?.toString() !== id) // exclude current NFT from "more collections"
    }
  };
}