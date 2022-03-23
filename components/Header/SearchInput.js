import { useRef, Fragment } from 'react';
import { Popover, Transition, Tab } from '@headlessui/react';
import clsx from 'clsx';
import Collections from './SearchResults/Collections';
import Items from './SearchResults/Items';
import Profiles from './SearchResults/Profiles';

const SEARCH_TABS = [
  { id: 'collections', label: 'Collections' },
  { id: 'creators', label: 'Items' },
  { id: 'profiles', label: 'Profiles' }
];

export default function SearchInput() {
  const buttonRef = useRef(null);
  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
     
      <Popover className="relative">
        {({ open }) => (
          <>
            <div className="relative">
              <input
                id="search"
                name="search"
                className="block w-full dark:bg-search text-ink dark:text-white lg:max-w-[268px] rounded-full py-2 pl-4 pr-3 border-transparent text-sm dark:placeholder:text-white focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-malibu focus:border-malibu sm:text-sm"
                placeholder="Explore"
                type="search"
                onFocus={() => buttonRef.current?.click()}
              />
            </div>
            <Popover.Button ref={buttonRef} className="hidden"></Popover.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-10 w-[390px] left-0 mt-[8px]">
                <div className="popover-container overflow-hidden rounded-[21px] text-manatee text-xs py-6 px-5">
                  <Tab.Group as="div">
                    <div className="mb-4">
                      <Tab.List className="-mb-px flex items-center justify-between space-x-8 shadow-tab rounded-tab h-[38px]" style={{ background: 'linear-gradient(161.6deg, #1E2024 -76.8%, #2A2F37 104.4%)'}}>
                        {
                          SEARCH_TABS.map(({ id, label }) => (
                            <Tab
                              key={id}
                              className={({ selected }) =>
                                clsx(
                                  selected
                                    ? 'bg-tabButton shadow-tabButton rounded-tab'
                                    : 'text-[#969EAB] hover:text-white',
                                  'whitespace-nowrap font-medium text-xs text-white px-5 w-[115px] h-[34px]'
                                )
                              }
                            >
                              { label }
                            </Tab>
                          ))
                        }
                      </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                      <Tab.Panel as="dl">
                        <Collections />
                      </Tab.Panel>
                      <Tab.Panel as="dl">
                        <Items />
                      </Tab.Panel>
                      <Tab.Panel as="dl">
                        <Profiles />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
