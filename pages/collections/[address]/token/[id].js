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
import NotFoundImage from "../../../../images/No-Image-Placeholder.png";

// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198
export default function Nft({ data: serverData, chainIdHex, chainId, address, connect, ethersProvider, marketplaceContract, tokenContract }) {
  const [data, setData] = useState(serverData)
  const isOwner = data?.owner === address?.toLowerCase() || false;
  // there can only be one active listing or auction for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can only be one active auction or listing for a token at the same time
  const activeAuction = data?.auctions?.find(auction => auction?.active);
  // there can be multiple active bids on a token at the same time
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

  // reset modal
  useEffect(() => {
    if (resetModal) {
      setResetModal(null);
    }
  }, [resetModal]);

  return (
    <div className='dark:bg-[#202225] dark:text-white'>
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-8xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-3">
            <div className="aspect-w-4 aspect-h-4 rounded-lg bg-gray-100 overflow-hidden">
              {data?.image ? (
                <Image
                src={`${resolveBunnyLink(data?.image)}?optimizer=image&width=600&height=600`}
                alt={data?.tokenId}
                className="object-center object-cover"
                layout="fill" 
              /> 
              ) : (
                <Image
                  src={NotFoundImage}
                  alt={data?.tokenId}
                  className="object-center object-cover"
                  layout="fill" 
                /> 
              )}
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
              <div className="mt-10 ">
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
                  <div className="flex flex-col mt-10">
                    <div className="overflow-x-auto">
                      <div className="align-middle inline-block min-w-full">
                        <div className="overflow-hidden sm:rounded-lg">
                          <table className="min-w-full">
                            <thead className="text-[#969EAB]">
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
                                  Rarity rank <b className='text-white'>#{data?.rarityRank}</b>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-[#969EAB]">
                              {data?.traits?.map((attribute) => (
                                <tr key={attribute?.trait_type}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{attribute?.trait_type}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">{attribute?.value}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">{attribute?.rarityPercent.toFixed(2)}%</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">{attribute?.rarityScore.toFixed(2)}</td>
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
        <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
            {isOwner ? (
              <div>
                <div className="grid grid-cols-1 pt-6">
                  {!activeListing && !activeAuction ? (
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
                        transactionCount={activeModal === NFT_MODALS.LIST ? transactionCount : null}
                        onClose={() => setActiveModal(null)}
                        onConfirm={async data => {
                          try {
                            setTransactionCount(0);
                            console.log(`data`, data)
                            data?.auctionType === 'fixed' ? await handleList(data) : await handleCreateAuction(data);
                            onModalSuccess({ modal: NFT_MODALS.LIST, transactionCount: 3 });
                          } catch(error) {
                            // reset modal on error
                            setResetModal(NFT_MODALS.LIST);
                          }
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {activeAuction ? (
                        <div>
                          <p>{`Min bid is ${activeAuction?.minBid / 1000000000} ETH`}</p>
                          <p>{`Untill ${fromUnixTime(activeAuction?.expiry)}`}</p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p>{`Listed for ${activeListing?.pricePerItem / 1000000000} ETH`}</p>
                            <p>{`Untill ${fromUnixTime(activeListing?.expiry)}`}</p>
                          </div>
                          <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.CHANGE_PRICE)}>
                            Change Price
                          </PrimaryButton>
                          <ChangePriceModal
                            isOpen={activeModal === NFT_MODALS.CHANGE_PRICE}
                            onClose={() => setActiveModal(null)}
                            onConfirm={async data => {
                              console.log(`data`, data)
                              await handleChangePrice(activeListing, data)
                            }}
                          />

                          <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.UNLIST)}>
                            Cancel Listing
                          </PrimaryButton>
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
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 pt-6">
                  {activeListing ? (
                    <>
                      <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.BUY_NOW)}>
                        Buy Now
                      </PrimaryButton>
                      <BuyNowModal
                        isOpen={activeModal === NFT_MODALS.BUY_NOW}
                        onClose={() => setActiveModal(null)}
                        onConfirm={() => handleAcceptListing(activeListing)}
                        name={data?.name}
                        price={activeListing?.pricePerItem}
                        imageUrl={resolveLink(data?.image)}
                        collection={data.collectionId}
                      />
                      <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.MAKE_OFFER)}>
                        Make Offer
                      </PrimaryButton>
                      <MakeOfferModal
                        isOpen={activeModal === NFT_MODALS.MAKE_OFFER}
                        onClose={() => setActiveModal(null)}
                        onConfirm={data => handlePlaceBid(data)}
                      />
                    </>
                  ) : (
                    <>
                      <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.MAKE_OFFER)}>
                        Make Offer
                      </PrimaryButton>
                      <MakeOfferModal
                        isOpen={activeModal === NFT_MODALS.MAKE_OFFER}
                        onClose={() => setActiveModal(null)}
                        onConfirm={data => handlePlaceBid(data)}
                      />
                    </>
                  )}
                  {activeAuction ? (
                    <>
                      <PrimaryButton className="mt-4" onClick={() => handleModal(NFT_MODALS.PLACE_BID)}>
                        Place Bid
                      </PrimaryButton>
                      <PlaceBidModal
                        isOpen={activeModal === NFT_MODALS.PLACE_BID}
                        onClose={() => setActiveModal(null)}
                        onConfirm={price => handlePlaceAuctionBid({price})}
                      />
                  </>
                  ) : null}
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