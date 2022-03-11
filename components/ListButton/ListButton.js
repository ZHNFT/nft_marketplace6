import { useState } from 'react';
import PrimaryButton from '../Buttons/PrimaryButton';
import ListModal from './ListModal';

export default function ListButton({ name, imageUrl, collection }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <PrimaryButton onClick={() => setShowModal(true)}>
        List
      </PrimaryButton>
      <ListModal
        name={name}
        imageUrl={imageUrl}
        collection={collection} 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
