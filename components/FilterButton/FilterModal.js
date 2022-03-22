import { Dialog } from '@headlessui/react';
import Filters from '../Filters/Filters';

export default function FilterModal({ open, close, filters }) {
  return (
    <Dialog
      open={open}
      onClose={close}
      className="fixed z-10 inset-0">
      <div className="flex items-center justify-center min-h-screen w-full h-full">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative p-5 bg-white dark:bg-[#282d35] w-full mx-2 md:mx-12 rounded-xl  h-full max-w-[900px] max-h-[600px] overflow-y-scroll">
          <Filters
            placement="desktop"
            filters={filters}
          />
        </div>
      </div>
    </Dialog>
  );
}
