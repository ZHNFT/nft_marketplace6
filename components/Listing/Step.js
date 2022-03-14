import clsx from 'clsx';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/outline';
import { COMPLETE_LISTING_STATUS } from '../../constants/nft';

const getStatusClass = ({ status }) => {
  switch(status) {
    case COMPLETE_LISTING_STATUS.SUCCESS:
      return 'bg-[#098241]';
    case COMPLETE_LISTING_STATUS.INACTIVE:
      return 'bg-[#666]';
    case COMPLETE_LISTING_STATUS.FAILED:
      return 'bg-red-600';
    default:
      return '';
  };
};

export default function Step(props) {
  const { className, title, children, isDefaultOpen, status } = props;
  return (
    <Disclosure defaultOpen={isDefaultOpen} as="div" className={className}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left border-[0.5px] border-manatee rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
            <div className="flex items-center">
              {
                status === COMPLETE_LISTING_STATUS.IN_PROGRESS
                  ? (
                    <svg role="status" className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  )
                  : (
                    <div className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      getStatusClass({ status })
                    )} />
                  )
              }
              <span className="text-lg ml-2">
                { title }
              </span>
            </div>
            <ChevronUpIcon
              className={`${
                open ? '' : 'transform rotate-180'
              } w-5 h-5 text-manatee`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
            { children }
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}