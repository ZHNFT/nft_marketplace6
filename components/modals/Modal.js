import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CrossIcon } from '../icons';

export default function Modal(props) {
  const { isOpen, title, children, onClose, paddingY = 6, paddingX = 5 } = props;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`relative inline-block align-bottom bg-white dark:bg-[#292f37] border-[0.5px] border-malibu rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full py-${paddingY} px-${paddingX}`}>
              <button
                type="button"
                className="absolute right-8"
                onClick={onClose}
              >
                <span className="sr-only">Close modal</span>
                <CrossIcon className="w-[13px]" />
              </button>
              {
                title && (
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-2xl leading-6 font-medium">
                          { title }
                        </Dialog.Title>
                      </div>
                    </div>
                  </div>
                )
              }
              <div className="px-3">
                { children }
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}