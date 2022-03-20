import { useState, useMemo } from 'react';
import GalleryContext from '../../contexts/GalleryContext';
import { NFT_MODALS } from '../../constants/nft';
import GalleryItem from './GalleryItem';
import MakeOfferModal from '../Modals/MakeOfferModal';
import PlaceBidModal from '../Modals/PlaceBidModal';
import { transformGalleryItem } from '../../Utils/helper'

export default function Gallery({ items }) {
  const defaultActiveModal = { type: '' };
  const [activeModal, setActiveModal] = useState(defaultActiveModal);
  const value = useMemo(
    () => ({ activeModal, setActiveModal }), 
    [activeModal]
  );
  return (
    <GalleryContext.Provider value={value}>
      <div className="grid justify-center sm:grid-cols-2 sm:justify-between md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto">
        {
          items?.map((item, index) => <GalleryItem key={index} item={transformGalleryItem(item)} />)
        }
      </div>
      <MakeOfferModal
        isOpen={activeModal.type === NFT_MODALS.MAKE_OFFER}
        onClose={() => setActiveModal(defaultActiveModal)}
        onConfirm={data => console.log(data)}
      />
      <PlaceBidModal
        isOpen={activeModal.type === NFT_MODALS.PLACE_BID}
        onClose={() => setActiveModal(defaultActiveModal)}
        onConfirm={data => console.log(data)}
      />
    </GalleryContext.Provider>
  );
}