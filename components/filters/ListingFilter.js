import { useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react'
import clsx from 'clsx';
import SecondaryButton from '../Buttons/SecondaryButton';
import { ArrowIcon } from '../icons';

const listTypes = [
  { value: 'buyNow', label: 'Buy now' },
  { value: 'auction', label: 'Auction' },
  { value: 'notListed', label: 'Not listed' },
  { value: 'hasOffers', label: 'Has offers' }
];

export default function ListingFilter() {
  const [selected, setSelected] = useState({
    buyNow: false,
    auction: false,
    notListed: false,
    hasOffers: false
  });

  return (
    <Disclosure as="div" className="mt-10 min-w-[200px]" defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="text-xs w-full text-left pb-4 flex justify-between items-start">
            Listing
            <ArrowIcon type={ open ? 'up' : 'down' } className="text-manatee w-[8px] mr-1.5 relative bottom-0.5" />
          </Disclosure.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
                {
                  listTypes.map(({ value, label }) => (
                    <SecondaryButton
                      key={value}
                      className={clsx('text-ink dark:text-white', selected[value] ? '!bg-cornflower !text-white' : '')}
                      onClick={() => setSelected({...selected, [value]: !selected[value]})}
                    >
                      { label }
                    </SecondaryButton>
                  ))
                }
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}