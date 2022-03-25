import { cloneElement } from 'react';

// Components
import Modal from './Modal';
import MakeOfferForm from '../Forms/MakeOfferForm';
import ListingForm from '../Forms/ListingForm';
import ChangePriceForm from '../Forms/ChangePriceForm';
import CancelListingModal from './CancelListingModal';

// Constants
import { NFT_MODALS } from '../../constants/nft';
import BuyNowForm from '../Forms/BuyNowForm';

const modalToTitleMap = {
  [NFT_MODALS.MAKE_OFFER]: 'Make an offer',
  [NFT_MODALS.LIST]: 'List item',
  [NFT_MODALS.PLACE_BID]: 'Place a bid',
  [NFT_MODALS.UNLIST]: 'Cancel listing',
  [NFT_MODALS.BUY_NOW]: 'Buy now',
  [NFT_MODALS.CHANGE_PRICE]: 'Change the listing price',
};

const modalToFormMap = {
  [NFT_MODALS.MAKE_OFFER]: <MakeOfferForm />, // Being used to place a bid on an auction or make an offer depending on active modal
  [NFT_MODALS.LIST]: <ListingForm />, // Being used to list an item for sale or list for auction
  [NFT_MODALS.PLACE_BID]: <MakeOfferForm />, // Being used to place a bid on an auction or make an offer depending on active modal
  [NFT_MODALS.UNLIST]: <CancelListingModal />, // Being used to cancel a listing
  [NFT_MODALS.BUY_NOW]: <BuyNowForm />,
  [NFT_MODALS.CHANGE_PRICE]: <ChangePriceForm />,
}

export default function SingleNftPageModal(props) {
  const { isOpen, onClose, activeModal, ...rest } = props;
  const title = modalToTitleMap[activeModal];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {activeModal ? cloneElement(modalToFormMap[activeModal], {
        handleClose: onClose,
        activeModal,
        ...rest,
      }) : null}
    </Modal>
  );
}