import ConfirmModal from './ConfirmModal';

export default function CancelListingModal({ isOpen, onClose, onConfirm }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Are you sure you want to cancel your listing"
      description="Canceling your listing will unpublish this sale from Hexagon and requires a transaction to make sure it will never be fulfillable."
      cancelLabel="Never mind"
      confirmLabel="Cancel listing"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}