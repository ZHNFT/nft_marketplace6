import { useState, useMemo } from 'react';
import GalleryContext from '../../contexts/GalleryContext';
import { GALLERY_MODALS } from '../../constants/gallery';
import GalleryItem from './GalleryItem';
import MakeOfferModal from '../modals/MakeOfferModal';

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
          items?.map((item, index) => <GalleryItem key={index} item={item} />)
        }
      </div>
      {
        <MakeOfferModal
          isOpen={activeModal.type === GALLERY_MODALS.MAKE_OFFER}
          onClose={() => setActiveModal(defaultActiveModal)}
          onConfirm={data => console.log(data)}
        />
      }
    </GalleryContext.Provider>
  );
}