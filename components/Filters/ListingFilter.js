import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Disclosure, Transition } from '@headlessui/react'
import clsx from 'clsx';
import SecondaryButton from '../Buttons/SecondaryButton';
import { ArrowIcon } from '../icons';

const listTypes = [
  { value: 'listed', label: 'Buy now' },
  { value: 'auctions', label: 'Auction' },
  { value: 'unlisted', label: 'Not listed' },
  { value: 'has-bids', label: 'Has offers' }
];

export default function ListingFilter({ isReset, onChange }) {
  const { query, isReady: isRouterReady } = useRouter();
  const { filter } = query;
  const defaultValue = useMemo(
    () => ({ listed: false, auctions: false, unlisted: false, 'has-bids': false })
  , []);
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    // initialize filters from query params on initial page load
    if(!isRouterReady || !filter) return;

    if (Array.isArray(filter)) {
      const updated = {...selected, [value]: !selected[value]};
      setSelected(filter.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, { ...selected }));
      return;
    }

    setSelected({
      ...selected,
      [filter]: true
    });
  }, [isRouterReady]);

  useEffect(() => {
    if (isReset) {
      setSelected(defaultValue);
    }
  }, [defaultValue, isReset]);

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
                      className={clsx('text-ink dark:text-white', selected[value] ? '!bg-cobalt dark:!bg-cornflower !text-white' : '!bg-cobalt dark:!bg-white/[0.1] dark:hover:!bg-white/[0.1] hover:!bg-cobalt')}
                      onClick={() => {
                        const updated = {...selected, [value]: !selected[value]};
                        setSelected(updated);
                        const filters = Object.keys(updated).reduce((acc, key) => {
                          if (updated[key] === true) {
                            acc.push(key);
                          }
                          return acc;
                        }, []);
                        onChange({ filters });
                      }}
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