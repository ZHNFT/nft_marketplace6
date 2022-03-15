import { Fragment, useCallback, useState } from 'react'
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
import { resolveLink } from '../../../../Utils';
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
  // there can only be one active listing for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can be multiple active bids on a token at the same time
  const activeBids = data?.bids?.filter(bid => bid?.active);
  const marketplaceAddress = marketplaceContract?.address;
  console.log(`data`, data)
  const [activeModal, setActiveModal] = useState(null);
  console.log(`activeBids`, activeBids)

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

    const nftContract = new ethers.Contract(data.collectionId, ["function setApprovalForAll(address _operator, bool _approved) external"], signer);
    await nftContract.setApprovalForAll(marketplaceAddress, true);

    let signature

    ({ listing, signature } = await getSignatureListing(listing, signer, ethers, marketplaceAddress, chainId))
    const token = await Web3Token.sign(() => signature, '1d');
    console.log(token);
    const response = await fetch(`https://hexagon-api.onrender.com/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listing)
    });

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
  const handlePlaceAuctionBid = useCallback(async function(offer) {
    const bid = Number(offer.price);
    const bidAmount = ethers.utils.parseEther(bid.toString());
    const allowance = await tokenContract.allowance(address, marketplaceAddress);
    const allowanceString = ethers.utils.formatEther(allowance.toString())

    if (Number(allowanceString) < offer.price) {
      const allow = await tokenContract.increaseAllowance(marketplaceAddress, bidAmount);
      const allowanceResult = await allow?.wait();
      console.log(`allowanceResult`, allowanceResult)
    }

    const tx = await marketplaceContract.placeAuctionBid(offer);
    const txResult = await tx?.wait();
    console.log(`txResult`, txResult)

  }, [marketplaceContract, address, tokenContract, marketplaceAddress])

  // For the owner of the NFT to change the price of an listing
  // we first cancel the current listing and then create a new listing
  const handleChangePrice = useCallback(async function(listing, price, expirationDate) {
    await handleCancelListing(listing);
    await handleList({ price, expirationDate });
  }, [handleCancelListing, handleList])

  return (
    <div className='bg-white'>
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-8xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:row-end-1 lg:col-span-3">
            <div className="aspect-w-4 aspect-h-4 rounded-lg bg-gray-100 overflow-hidden">
              <Image src={resolveLink(data?.image)} alt={data?.tokenId} className="object-center object-cover" layout="fill" />
            </div>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Share</h3>
                <ul role="list" className="flex items-center space-x-6">
                  <li>
                    <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Facebook</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Instagram</span>
                      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Twitter</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
          </div>

          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{data?.name}</h1>

              <h2 id="information-heading" className="sr-only">
                NFT information
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {/* Could also link to profile/account within the market place instead of blockexplorer */}
                Owned by:
                <Link href="/users/[address]" as={`/users/${data?.owner}`} passHref>
                  <a className="hover:text-indigo-600">
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
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
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
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
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
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
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
                      {data?.owner === address && (
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

          <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
            {isOwner ? (
              <div>
                <div className="grid grid-cols-1 pt-6">
                  {!activeListings ? (
                    <>
                      <PrimaryButton onClick={() => handleModal(NFT_MODALS.LIST)}>
                        List
                      </PrimaryButton>
                      <ListModal
                        name={data?.name}
                        imageUrl={resolveLink(data?.image)}
                        collection={data.collectionId} 
                        isOpen={activeModal === NFT_MODALS.LIST}
                        onClose={() => setActiveModal(null)}
                        onConfirm={handleList}
                      />
                    </>
                  ) : (
                    <>
                      <div className='text-black'>
                        <p>{`Listed for ${activeListings?.pricePerItem / 1000000000} ETH`}</p>
                        <p>{`Untill ${fromUnixTime(activeListings?.expiry)}`}</p>
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
                        onConfirm={() => handleCancelListing(activeListings)}
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