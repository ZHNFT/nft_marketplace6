import { useState } from 'react';
import { FilterIcon } from '../icons';
import FilterModal from './FilterModal';

export default function FilterButton({ filters }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setShowModal(true)}>
        <FilterIcon className="w-[22px]" />
      </button>
      <FilterModal filters={filters} open={showModal} close={() => setShowModal(false)} />
    </>
  );
}
