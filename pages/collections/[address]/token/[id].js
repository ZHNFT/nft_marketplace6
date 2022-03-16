import { Fragment, useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { ethers } from "ethers";
import Link from 'next/link'
import Web3Token from 'web3-token';
import { add, fromUnixTime } from 'date-fns';
import Image from 'next/image'
import clsx from "clsx";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { StarIcon } from '@heroicons/react/solid'
import { Tab } from '@headlessui/react'
import { resolveLink, resolveBunnyLink } from '../../../../Utils';
import { getSignatureListing } from '../../../../Utils/marketplaceSignatures';
import { NFT_MODALS } from '../../../../constants/nft';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import ListModal from '../../../../components/modals/ListModal';
import PlaceBidModal from '../../../../components/modals/PlaceBidModal';
import MakeOfferModal from '../../../../components/modals/MakeOfferModal';
import BuyNowModal from '../../../../components/modals/BuyNowModal';
import ChangePriceModal from '../../../../components/modals/ChangePriceModal';
import CancelListingModal from '../../../../components/modals/CancelListingModal';

// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198
export default function Nft({ data, chainIdHex, chainId, address, connect, ethersProvider, marketplaceContract, tokenContract }) {
  const isOwner = data?.owner === address?.toLowerCase() || false;
  // there can only be one active listing or auction for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can only be one active auction or listing for a token at the same time
  const activeAuction = data?.auctions?.find(auction => auction?.active);
  // there can be multiple active bids on a token at the same time
  const activeBids = data?.bids?.filter(bid => bid?.active);

  const marketplaceAddress = marketplaceContract?.address;
  console.log(`data`, data)
  const [activeModal, setActiveModal] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  console.log(`activeBids`, activeBids)

  const [transactionCount, setTransactionCount] = useState(0);

  // refresh server side data
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleModal = modal => address ? setActiveModal(modal) : connect();

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

    // reset transaction count
    setTransactionCount(0);
    try {
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
      
      if (response.status === 200) {
        // refresh data and close modal
        setTransactionCount(3);
        refreshData();
        setTimeout(() => setActiveModal(null), 2000);
      } else {
        throw new Error('error posting listing to database');
      }
    } catch (error) {
      // reset and close modal on error
      setResetModal(NFT_MODALS.LIST);
      setActiveModal(null);
    }
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
    const tx = await marketplaceContract.AcceptBid(offer);
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)
  }, [marketplaceContract])

  // For non-owners to cancel their bid
  const handleCancelBid = useCallback(async function(offer) {
    const tx = await marketplaceContract.CancelBid(offer);
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)
  }, [marketplaceContract])

  // For the owner of the NFT to cancel their listing
  const handleCancelListing = useCallback(async function(listing) {
    console.log(listing);
    const tx = await marketplaceContract.CancelListing(listing);
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)
  }, [marketplaceContract])

  // For the owner of the NFT to create an auction, its not possible to cancel an auction
  const handleCreateAuction = useCallback(async function () {
    const signer = ethersProvider.getSigner();
    const nonce = await signer.getTransactionCount();

    let auction = {
      collectionAddress: data?.collectionId,
      owner: data?.owner,
      tokenId: data?.tokenId,
      expiry: 1647868506, // get from modal
      quantity: 1,
      minBid: 500000000000000000, // get from modal
      percentIncrement: 50 // get from modal
    }

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
  const handleChangePrice = useCallback(async function(listing, price, expirationDate) {
    await handleCancelListing(listing);
    await handleList({ price, expirationDate });
  }, [handleCancelListing, handleList])

  return (
    <div className='dark:bg-[#202225] dark:text-white'>
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-8xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-3">
            <div className="aspect-w-4 aspect-h-4 rounded-lg bg-gray-100 overflow-hidden">
              <Image
                src={`${resolveBunnyLink(data?.image)}?optimizer=image&width=600&height=600`}
                alt={data?.tokenId}
                className="object-center object-cover"
                layout="fill" 
              />
            </div>
          </div>

          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:col-span-4 w-full">
            <div className="flex flex-col">
              <h1 className="text-2xl tracking-tight sm:text-3xl">{data?.name}</h1>

              <h2 id="information-heading" className="sr-only">
                NFT information
              </h2>
              <p className="text-sm text-[#969EAB] mt-2">
                {/* Could also link to profile/account within the market place instead of blockexplorer */}
                Owned by:
                <Link href="/users/[address]" as={`/users/${data?.owner}`} passHref>
                  <a className="hover:text-indigo-600 dark:text-white text-black">
                    {isOwner ? ' You' : ` ${data?.owner}`}
                  </a>
                </Link>
              </p>
            </div>
            <Tab.Group as="div">
              <div className="border-b border-gray-200 border-t border-gray-200 mt-10 ">
                <Tab.List className="-mb-px flex space-x-8">
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'border-indigo-600'
                          : 'border-transparent text-[#969EAB] hover:text-gray-800 hover:border-gray-300',
                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                      )
                    }
                  >
                    Traits
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'border-indigo-600'
                          : 'border-transparent text-[#969EAB] hover:text-gray-800 hover:border-gray-300',
                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                      )
                    }
                  >
                    Bids
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'border-indigo-600'
                          : 'border-transparent text-[#969EAB] hover:text-gray-800 hover:border-gray-300',
                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                      )
                    }
                  >
                    Details
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels as={Fragment}>
                <Tab.Panel as="dl">
                  <div className="flex flex-col mt-10">
                    <div className="overflow-x-auto">
                      <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Name/Type
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Property/Value
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Rarity %
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Rarity rank <b className='text-black'>#{data?.rarityRank}</b>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {data?.traits?.map((attribute) => (
                                <tr key={attribute?.trait_type}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attribute?.trait_type}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attribute?.value}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attribute?.rarityPercent.toFixed(2)}%</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attribute?.rarityScore.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
                    <h3 className="text-sm font-medium text-gray-900">Description</h3>
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
        <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
            {isOwner ? (
              <div>
                <div className="grid grid-cols-1 pt-6">
                  {!activeListing ? (
                    <>
                      <PrimaryButton onClick={() => handleModal(NFT_MODALS.LIST)}>
                        List
                      </PrimaryButton>
                      <ListModal
                        name={data?.name}
                        imageUrl={resolveLink(data?.image)}
                        collection={data.collectionId} 
                        isOpen={activeModal === NFT_MODALS.LIST}
                        isReset={resetModal === NFT_MODALS.LIST}
                        transactionCount={transactionCount}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleList}
                      />
                    </>
                  ) : (
                    <>
                      <div className='text-black'>
                        <p>{`Listed for ${activeListing?.pricePerItem / 1000000000} ETH`}</p>
                        <p>{`Untill ${fromUnixTime(activeListing?.expiry)}`}</p>
                      </div>
                      <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.CHANGE_PRICE)}>
                        Change Price
                      </PrimaryButton>
                      <ChangePriceModal
                        isOpen={activeModal === NFT_MODALS.CHANGE_PRICE}
                        onClose={() => setActiveModal(null)}
                        onConfirm={data => console.log(data)}
                      />

                      <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.UNLIST)}>
                        Cancel Listing
                      </PrimaryButton>
                      <CancelListingModal
                        isOpen={activeModal === NFT_MODALS.UNLIST}
                        onClose={() => setActiveModal(null)}
                        onConfirm={() => handleCancelListing(activeListing)}
                      />    
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 pt-6">
                  <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.BUY_NOW)}>
                    Buy Now
                  </PrimaryButton>
                  <BuyNowModal
                    isOpen={activeModal === NFT_MODALS.BUY_NOW}
                    onClose={() => setActiveModal(null)}
                    onConfirm={data => console.log(data)}
                    name={data?.name}
                    imageUrl={resolveLink(data?.image)}
                    price={20}
                    collection={data.collectionId}
                  />

                  <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.PLACE_BID)}>
                    Place Bid
                  </PrimaryButton>
                  <PlaceBidModal
                    isOpen={activeModal === NFT_MODALS.PLACE_BID}
                    onClose={() => setActiveModal(null)}
                    onConfirm={price => handlePlaceBid(price)}
                  />

                  <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.MAKE_OFFER)}>
                    Make Offer
                  </PrimaryButton>
                  <MakeOfferModal
                    isOpen={activeModal === NFT_MODALS.MAKE_OFFER}
                    onClose={() => setActiveModal(null)}
                    onConfirm={data => console.log(data)}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Activity */}
          <div>
            Here comes the activity feed/table
          </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { params: { address, id } } = context;
  const url = `https://hexagon-api.onrender.com/collections/${address}/token/${id}`;
  const res = await fetch(url)
  const data = await res?.json()

  return { props: { data } };
}