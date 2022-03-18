import { Fragment, useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { ethers } from "ethers";
import clsx from "clsx";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Web3Token from 'web3-token';
import { Tab } from '@headlessui/react'
import Link from 'next/link';
import { BeeIcon } from '../../../../components/icons';
import { resolveLink } from '../../../../Utils';
import { getSignatureListing } from '../../../../Utils/marketplaceSignatures';
import { NFT_MODALS, NFT_LISTING_STATE } from '../../../../constants/nft';
import { convertToUsd } from '../../../../Utils/helper';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../../../components/Buttons/SecondaryButton';
import ListModal from '../../../../components/modals/ListModal';
import PlaceBidModal from '../../../../components/modals/PlaceBidModal';
import MakeOfferModal from '../../../../components/modals/MakeOfferModal';
import BuyNowModal from '../../../../components/modals/BuyNowModal';
import ChangePriceModal from '../../../../components/modals/ChangePriceModal';
import CancelListingModal from '../../../../components/modals/CancelListingModal';
import ProductPreview from '../../../../components/Product/ProductPreview';
import ProductDetailsHeader from '../../../../components/Product/ProductDetailsHeader';
import Activity from '../../../../components/Product/Activity';
import CollectionSlider from '../../../../components/Product/CollectionSlider';
import ItemPrice from '../../../../components/ItemPrice/ItemPrice';
import TraitsTable from '../../../../components/Traits/TraitsTable';

// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198
export default function Nft({ data: serverData, nfts, chainIdHex, chainId, address, connect, ethersProvider, marketplaceContract, tokenContract }) {
  const [data, setData] = useState(serverData)
  const isOwner = data?.owner === address?.toLowerCase() || false;
  // there can only be one active listing or auction for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can only be one active auction or listing for a token at the same time
  const activeAuction = data?.auctions?.find(auction => auction?.active);
  // there can be multiple active bids on a token at the same time, these are all bids on an item: listed, non-listed and on auction
  const activeBids = data?.bids?.filter(bid => bid?.active);

  console.log(`activeListing`, activeListing)
  console.log(`activeAuction`, activeAuction)
  console.log(`activeBids`, activeBids)
  
  const marketplaceAddress = marketplaceContract?.address;

  const [activeModal, setActiveModal] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);

  // refresh server side data
  const router = useRouter();
  const { address: contractAddress, id } = router.query;

  const fetchData = useCallback(async function() {
    const url = `https://hexagon-api.onrender.com/collections/${contractAddress}/token/${id}`;
    const res = await fetch(url)
    const data = await res?.json()
    setData(data);
  }, [contractAddress, id])

  const handleModal = modal => address ? setActiveModal(modal) : connect();

  // reset and close modal
  const onModalSuccess = ({ modal, transactionCount }) => {
    fetchData();
    setTransactionCount(transactionCount);
    setTimeout(() => setActiveModal(null), 300);
    setTimeout(() => setResetModal(modal), 400);
  };

  // For owner of an NFT to list the NFT
  const handleList = useCallback(async function({ price, expirationDate }) {
    const signer = ethersProvider.getSigner();
    const nonce = await signer.getTransactionCount();

    let listing = {
      contractAddress: data.collectionId,
      tokenId: data.tokenId,
      userAddress: data?.owner,
      // TODO fix this in correct formatting wei/gwei/eth in combination with the input value (price)
      pricePerItem: (Number(price) * 1000000000).toString(),
      quantity: 1,
      expiry: expirationDate,
      nonce: nonce
    }

    const nftContract = new ethers.Contract(data.collectionId, ["function setApprovalForAll(address _operator, bool _approved) external"], signer);
    const tx = await nftContract.setApprovalForAll(marketplaceAddress, true);
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)
    setTransactionCount(1);

    let signature

    ({ listing, signature } = await getSignatureListing(listing, signer, ethers, marketplaceAddress, chainId))
    const token = await Web3Token.sign(() => signature, '1d');

    console.log('token', token);
    setTransactionCount(2);
    
    const response = await fetch(`https://hexagon-api.onrender.com/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listing)
    });

    console.log(`response`, response)
  }, [ethersProvider, chainId, data.tokenId, data.collectionId, data.owner, marketplaceAddress])

  // For non-owners to place a bid on an listing
  const handlePlaceBid = useCallback(async function({ price, expirationDate }) {
    const signer = ethersProvider.getSigner();
    const nonce = await signer.getTransactionCount();

    let offer = {
      contractAddress: data.collectionId,
      tokenId: data.tokenId,
      userAddress: address,
      // TODO fix this in correct formatting wei/gwei/eth in combination with the input value (price)
      pricePerItem: (Number(price) * 1000000000).toString(),
      quantity: 1,
      expiry: expirationDate,
      nonce: nonce
    }

    const bid = Number(price);
    const bidAmount = ethers.utils.parseEther(bid.toString());
    const allowance = await tokenContract.allowance(address, marketplaceAddress);
    const allowanceString = ethers.utils.formatEther(allowance.toString())

    if (Number(allowanceString) < price) {
      const allow = await tokenContract.increaseAllowance(marketplaceAddress, bidAmount);
      const allowanceResult = await allow?.wait();
      console.log(`allowanceResult`, allowanceResult)
    }

    let signature

    ({ offer, signature } = await getSignatureOffer(offer, signer, ethers, marketplaceAddress, chainId))
    const token = await Web3Token.sign(() => signature, '1d');

    const response = await fetch(`https://hexagon-api.onrender.com/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(offer)
    });

  }, [ethersProvider, chainId, data.tokenId, tokenContract, data.collectionId, address, marketplaceAddress])

  // For the owner of the NFT to accept a bid
  const handleAcceptBid = useCallback(async function(offer) {
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
  }, [marketplaceContract])

  // For non-owners to cancel their bid
  const handleCancelBid = useCallback(async function(offer) {
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
  }, [marketplaceContract])

    // For the non-owners of the NFT to buy now/accept the listing of the owner
    const handleAcceptListing = useCallback(async function(listing) {
      const tx = await marketplaceContract.AcceptListing({
        contractAddress: listing?.contractAddress || listing?.collectionId,
        userAddress: listing.userAddress,
        tokenId: listing.tokenId,
        pricePerItem: listing.pricePerItem,
        quantity: listing.quantity,
        expiry: listing.expiry,
        nonce: listing.nonce,
        r: listing.r,
        s: listing.s,
        v: listing.v,
      });
      const txResult = await tx?.wait();
      console.log(`txResult`, txResult)
    }, [marketplaceContract])

  // For the owner of the NFT to cancel their listing
  const handleCancelListing = useCallback(async function(listing) {
    const tx = await marketplaceContract.CancelListing({
      contractAddress: listing?.contractAddress || listing?.collectionId,
      userAddress: listing.userAddress,
      tokenId: listing.tokenId,
      pricePerItem: listing.pricePerItem,
      quantity: listing.quantity,
      expiry: listing.expiry,
      nonce: listing.nonce,
      r: listing.r,
      s: listing.s,
      v: listing.v,
    });
    console.log(`tx`, tx)
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)
    setTransactionCount(1);
  }, [marketplaceContract])

  // For the owner of the NFT to create an auction, its not possible to cancel an auction
  const handleCreateAuction = useCallback(async function ({ price, expirationDate, percent }) {
    const signer = ethersProvider.getSigner();

    let auction = {
      collectionAddress: data?.collectionId,
      owner: data?.owner,
      tokenId: data?.tokenId,
      expiry: expirationDate,
      quantity: 1,
      minBid: (Number(price) * 1000000000).toString(),
      percentIncrement: Number(percent) * 10, // for example 5% should be passed to the contract as 50
      highestBid: 0,
      highestBidder: '0x0000000000000000000000000000000000000000',
    }
    console.log(`auction`, auction)
    const nftContract = new ethers.Contract(data.collectionId, ["function setApprovalForAll(address _operator, bool _approved) external"], signer);
    await nftContract.setApprovalForAll(marketplaceAddress, true);

    const token = await Web3Token.sign(async msg => await signer.signMessage(msg), '1d');
    console.log(token);
    const response = await fetch(`https://hexagon-api.onrender.com/auctions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(auction)
    });

    const tx = await marketplaceContract.placeAuction(auction);
    console.log(`tx`, tx)
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)

  }, [data?.collectionId, data?.owner, data?.tokenId, ethersProvider, marketplaceAddress, marketplaceContract])

  // For non-owners to place a bid on an auction
  const handlePlaceAuctionBid = useCallback(async function({ price }) {
    const bid = Number(price);
    const bidAmount = ethers.utils.parseEther(bid.toString());
    const allowance = await tokenContract.allowance(address, marketplaceAddress);
    const allowanceString = ethers.utils.formatEther(allowance.toString())

    let offer = {
      collectionAddress: data?.collectionId,
      owner: data?.owner,
      tokenId: data?.tokenId,
      amount: (Number(price) * 1000000000).toString(),
    };

    if (Number(allowanceString) < price) {
      const allow = await tokenContract.increaseAllowance(marketplaceAddress, bidAmount);
      const allowanceResult = await allow?.wait();
      console.log(`allowanceResult`, allowanceResult)
    }

    // offer should include collectionAddress, tokenId, owner and amount
    const tx = await marketplaceContract.placeAuctionBid(offer);
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)

  }, [marketplaceContract, address, tokenContract, marketplaceAddress, data?.tokenId, data?.collectionId, data?.owner])

  // For the owner of the NFT to change the price of an listing
  // we first cancel the current listing and then create a new listing
  const handleChangePrice = useCallback(async function(listing, price) {
    await handleCancelListing(listing);
    await handleList({ price, expirationDate: listing?.expiry });
  }, [handleCancelListing, handleList])

  // reload data when navigating to the same route
  useEffect(() => {
    setData(serverData);
  }, [serverData]);

  // reset modal
  useEffect(() => {
    if (resetModal) {
      setResetModal(null);
    }
  }, [resetModal]);

  return (
    <div className='dark:bg-[#202225] dark:text-white'>
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-8 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product Image/Preview */}
          <ProductPreview
            className="lg:col-span-4 lg:max-w-[472px]"
            name={data?.name}
            image={data?.image}
            expiry={activeAuction?.expiry || activeListing?.expiry}
            listingState={(() => {
              if (activeAuction) return NFT_LISTING_STATE.IN_AUCTION;
              if (activeListing) return NFT_LISTING_STATE.FOR_SALE;
              return NFT_LISTING_STATE.NOT_LISTED;
            })()}
          />

          {/* Product details */}
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
              { isOwner ? (<>
                  { // Owner & not listed
                    !activeListing && !activeAuction  && (
                      <>
                        <p className="text-manatee font-medium">This items is not currently listed</p>
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
                          <ListModal
                            name={data?.name}
                            imageUrl={resolveLink(data?.image)}
                            collection={data.collectionId} 
                            isOpen={activeModal === NFT_MODALS.LIST}
                            isReset={resetModal === NFT_MODALS.LIST}
                            transactionCount={activeModal === NFT_MODALS.LIST ? transactionCount : null}
                            onClose={() => setActiveModal(null)}
                            onConfirm={async data => {
                              try {
                                setTransactionCount(0);
                                console.log(`data`, data)
                                data?.auctionType === 'fixed' ? await handleList(data) : await handleCreateAuction(data);
                                onModalSuccess({ modal: NFT_MODALS.LIST, transactionCount: 3 });
                              } catch(error) {
                                console.log(error);
                                // reset modal on error
                                setResetModal(NFT_MODALS.LIST);
                              }
                            }}
                          />
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
                            <ChangePriceModal
                              isOpen={activeModal === NFT_MODALS.CHANGE_PRICE}
                              onClose={() => setActiveModal(null)}
                              onConfirm={async data => {
                                console.log(`data`, data)
                                await handleChangePrice(activeListing, data)
                              }}
                            />
                          </p>
                          <div className="flex items-baseline relative">
                            <BeeIcon className="absolute w-[28px] -left-[4px] -top-[3px]" />
                            <span className="text-base font-medium ml-6">{activeListing.pricePerItem / 1000000000}</span>
                            <span className="text-xs text-manatee ml-2">$ { convertToUsd({ value: activeListing.pricePerItem }) }</span>
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
                          <CancelListingModal
                            isOpen={activeModal === NFT_MODALS.UNLIST}
                            isReset={resetModal === NFT_MODALS.UNLIST}
                            transactionCount={activeModal === NFT_MODALS.UNLIST ? transactionCount : null}
                            onClose={() => setActiveModal(null)}
                            onConfirm={async () => {
                              try {
                                setTransactionCount(0);
                                await handleCancelListing(activeListing);
                                onModalSuccess({ modal: NFT_MODALS.UNLIST, transactionCount: 2 });
                              } catch(error) {
                                console.log(`error`, error)
                                // reset modal on error
                                setResetModal(NFT_MODALS.UNLIST);
                              }
                            }}
                          />
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
                        <p className="text-manatee font-medium">This items is not currently listed</p>
                        <div className="ml-auto">
                          <SecondaryButton
                            className="border-manatee text-ink dark:text-white"
                            onClick={() => handleModal(NFT_MODALS.MAKE_OFFER)}
                          >
                            Make offer
                          </SecondaryButton>
                          {
                            !!data?.highestBid && (
                              <p className="text-center text-xxs relative h-[12px]"><ItemPrice label="Highest" value={data?.highestBid / 1000000000} /></p>
                            )
                          }
                          <MakeOfferModal
                            isOpen={activeModal === NFT_MODALS.MAKE_OFFER}
                            onClose={() => setActiveModal(null)}
                            onConfirm={data => handlePlaceBid(data)}
                          />
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
                            <span className="text-xs text-manatee ml-2">$ { convertToUsd({ value: activeListing.pricePerItem }) }</span>
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
                          <BuyNowModal
                            isOpen={activeModal === NFT_MODALS.BUY_NOW}
                            onClose={() => setActiveModal(null)}
                            onConfirm={() => handleAcceptListing(activeListing)}
                            name={data?.name}
                            price={activeListing?.pricePerItem}
                            imageUrl={resolveLink(data?.image)}
                            collection={data.collectionId}
                          />
                          <MakeOfferModal
                            isOpen={activeModal === NFT_MODALS.MAKE_OFFER}
                            onClose={() => setActiveModal(null)}
                            onConfirm={data => handlePlaceBid(data)}
                          />
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
                          <PlaceBidModal
                            isOpen={activeModal === NFT_MODALS.PLACE_BID}
                            onClose={() => setActiveModal(null)}
                            onConfirm={price => handlePlaceAuctionBid({price})}
                          />
                        </div>
                      </>
                    )
                  }
                </>)
              }
            </div>
            
            <Tab.Group as="div">
              <div className="mt-4">
                <Tab.List className="-mb-px flex items-center space-x-8 shadow-tab rounded-tab h-[38px]" style={{ background: 'linear-gradient(161.6deg, #1E2024 -76.8%, #2A2F37 104.4%)'}}>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'bg-tabButton shadow-tabButton rounded-tab'
                          : 'text-[#969EAB] hover:text-white',
                        'whitespace-nowrap font-medium text-sm w-[115px] h-[34px]'
                      )
                    }
                  >
                    Properties
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'bg-tabButton shadow-tabButton rounded-tab'
                          : 'text-[#969EAB] hover:text-white',
                        'whitespace-nowrap font-medium text-sm w-[115px] h-[34px]'
                      )
                    }
                  >
                    Bids
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'bg-tabButton shadow-tabButton rounded-tab'
                          : 'text-[#969EAB] hover:text-white',
                        'whitespace-nowrap font-medium text-sm w-[115px] h-[34px]'
                      )
                    }
                  >
                    Details
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels as={Fragment}>
                <Tab.Panel as="dl">
                  <div className="flex flex-col mt-2">
                    <div className="overflow-x-auto">
                      <div className="align-middle inline-block min-w-full">
                        <div className="overflow-hidden sm:rounded-lg">
                          <TraitsTable traits={data?.traits} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

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

                <Tab.Panel className="pt-10" as="dl">
                    <h3 className="text-sm font-medium">Description</h3>
                    <div className="mt-4 prose prose-sm text-gray-500">
                      <ReactMarkdown
                        className='mt-6 whitespace-pre-line'
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({node, ...props}) => <a {...props} className="text-indigo-600 hover:underline" />,
                          p: ({node, ...props}) => <p {...props} className="text-gray-500" />
                        }}
                      >
                        {data?.metadata?.description}
                      </ReactMarkdown>
                    </div>
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
  const [res, nftsRes ] = await Promise.all([fetch(url), fetch(collectionUrl, { method: 'POST' })]);
  const data = await res?.json();
  const nfts = await nftsRes?.json();

  return {
    props: {
      data,
      nfts: nfts?.results?.filter(result => result?.tokenId?.toString() !== id) // exclude current NFT from "more collections"
    }
  };
}