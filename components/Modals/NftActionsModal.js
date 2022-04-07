import { cloneElement, useEffect, useCallback, useState } from 'react';

// Components
import Modal from './Modal';
import MakeOfferForm from '../Forms/MakeOfferForm';
import ListingForm from '../Forms/ListingForm';
import ChangePriceForm from '../Forms/ChangePriceForm';
import CancelListingModal from './CancelListingModal';

// Constants
import { NFT_MODALS } from '../../constants/nft';
import BuyNowForm from '../Forms/BuyNowForm';

// Utils
import { resolveBunnyLink } from '../../Utils';

const modalToTitleMap = {
  [NFT_MODALS.MAKE_OFFER]: 'Make an offer',
  [NFT_MODALS.LIST]: 'List item',
  [NFT_MODALS.PLACE_BID]: 'Place a bid',
  [NFT_MODALS.UNLIST]: 'Cancel listing',
  [NFT_MODALS.BUY_NOW]: 'Buy now',
  [NFT_MODALS.CHANGE_PRICE]: 'Set new listing price',
};

const modalToFormMap = {
  [NFT_MODALS.MAKE_OFFER]: <MakeOfferForm />, // Being used to place a bid on an auction or make an offer depending on active modal
  [NFT_MODALS.LIST]: <ListingForm />, // Being used to list an item for sale or list for auction
  [NFT_MODALS.PLACE_BID]: <MakeOfferForm />, // Being used to place a bid on an auction or make an offer depending on active modal
  [NFT_MODALS.UNLIST]: (
    <CancelListingModal
      description="Canceling your listing will unpublish this sale from Hexagon and requires a transaction to make sure it will never be fulfillable."
      confirmLabel="Cancel"
    />
  ), // Being used to cancel a listing
  [NFT_MODALS.BUY_NOW]: <BuyNowForm />,
  [NFT_MODALS.CHANGE_PRICE]: <ChangePriceForm />,
}

export default function NftActionsModal(props) {
  const { isOpen, onClose, activeModal, tokenId, collectionId, address, ...rest } = props;
  const title = modalToTitleMap[activeModal];
  const [data, setData] = useState({});

  // there can only be one active listing or auction for a token at the same time
  const activeListing = data?.listings?.find(listing => listing?.active);
  // there can only be one active auction or listing for a token at the same time
  const activeAuction = data?.auctions?.find(auction => auction?.active);

  // if item is on auction the owner in the data object is the marketplace address so we need to take the owner from the active auction instead
  const isOwner = activeAuction ? activeAuction.owner === address : data?.owner === address || false;
  const owner = activeAuction ? activeAuction?.owner : data?.owner;

  const fetchData = useCallback(async function() {
    const url = `https://api.hexag0n.io/collections/${collectionId}/token/${tokenId}`;
    const res = await fetch(url)
    const data = await res?.json()

    setData(data);
  }, [collectionId, tokenId])

  useEffect(() => {
    if (collectionId && tokenId) {
    fetchData();
    }
  }, [fetchData, collectionId, tokenId])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {activeModal ? cloneElement(modalToFormMap[activeModal], {
        handleClose: onClose,
        activeModal,
        activeListing: { ...activeListing, highestBid: data?.highestBid },
        activeAuction: activeAuction,
        imageUrl: resolveBunnyLink(data?.imageHosted),
        owner,
        name: data?.name,
        collectionId: collectionId,
        tokenId: tokenId,
        address,
        ...rest,
      }) : null}
    </Modal>
  );
}