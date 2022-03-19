import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { ellipseAddress } from '../../Utils';

export default function ProfileMenuButton({ address, name, imageUrl, children }) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="ml-4 border-[0.5px] border-manatee h-[38px] rounded-full flex items-center py-1 pl-1 pr-2.5 focus:outline-none focus:ring-1 focus:ring-malibu"
          >
            <span className="sr-only">Open user menu</span>
            <Image className="h-8 w-8 rounded-full" src={imageUrl} alt="" width={"27"} height={"27"} />
            <div className="flex flex-col text-left pr-2.5 pl-2">
              <span className="text-xs font-medium leading-none truncate max-w-[100px]">{name || 'Unnamed'}</span>
              <span className="text-xxs leading-none mt-0.5">{ ellipseAddress(address, 4) }</span>
            </div>
            {
              open ? <ChevronUpIcon className="w-[16px]" /> : <ChevronDownIcon className="w-[16px]" />
            }
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 lg:w-[250px] right-0 mt-[8px]">
              <div
                className="overflow-hidden rounded-[21px] text-manatee text-xs py-6 px-5"
                style={{
                  background: 'linear-gradient(161.6deg, #1E2024 -76.8%, #2A2F37 104.4%)',
                  boxShadow: '2px 4px 15px rgba(21, 23, 26, 0.05)'
                }}
              >
                { children }
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}