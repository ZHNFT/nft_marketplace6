// Components
import Modal from './Modal';
import ActiveModal from './ActiveModal';

// Constants
import { NFT_MODALS } from '../../constants/nft';

const modalToTitleMap = {
  [NFT_MODALS.MAKE_OFFER]: 'Make an offer',
  [NFT_MODALS.LIST]: 'List item',
  [NFT_MODALS.PLACE_BID]: 'Place a bid',
  [NFT_MODALS.UNLIST]: 'Cancel listing',
  [NFT_MODALS.BUY_NOW]: 'Buy now',
  [NFT_MODALS.CHANGE_PRICE]: 'Set new listing price',
};

export default function NftActionsModal(props) {
  const { isOpen, onClose, activeModal, tokenId, collectionId, address, ...rest } = props;
  const title = modalToTitleMap[activeModal];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {activeModal ? (
        <ActiveModal
          activeModal={activeModal}
          collectionId={collectionId}
          tokenId={tokenId}
          onClose={onClose}
          address={address}
          {...rest}
        />
      )  : null}
    </Modal>
  );
}