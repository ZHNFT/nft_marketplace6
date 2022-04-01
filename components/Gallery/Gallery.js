import { useState, useMemo } from 'react';
import GalleryContext from '../../contexts/GalleryContext';
import GalleryItem from './GalleryItem';
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
      <div className="grid justify-center sm:grid-cols-2 sm:justify-between md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-2 gap-x-5 mx-auto">
        {
          items?.map((item, index) => <GalleryItem key={index} item={transformGalleryItem(item)} />)
        }
      </div>
    </GalleryContext.Provider>
  );
}