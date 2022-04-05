import { useRef, useState, useEffect, useCallback, Fragment } from 'react';
import { useRouter } from 'next/router';
import { Popover, Transition, Tab } from '@headlessui/react';
import clsx from 'clsx';
import { searchCollectionUrl, searchTokenUrl, searchUserUrl } from '../../constants/url';
import { useDidMount } from '../../hooks/useDidMount';
import { useDebounce } from '../../hooks/useDebounce';
import Collections from './SearchResults/Collections';
import Items from './SearchResults/Items';
import Profiles from './SearchResults/Profiles';
import Spinner from '../Spinner/Spinner';

const SEARCH_TABS = [
  { id: 'collections', label: 'Collections' },
  { id: 'creators', label: 'Items' },
  { id: 'profiles', label: 'Profiles' }
];

export default function SearchInput() {
  const buttonRef = useRef(null);
  const isPopoverOpen = buttonRef?.current?.getAttribute('aria-expanded');
  const didMount = useDidMount();
  const { asPath } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState();
  const [isLoading, setIsLoading] = useState();
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  
  const searchData = useCallback(async function() {
    const collectionUrl = searchCollectionUrl({ searchTerm: debouncedSearchTerm });
    const tokenUrl = searchTokenUrl({ searchTerm: debouncedSearchTerm });
    const userUrl = searchUserUrl({ searchTerm: debouncedSearchTerm });
    const [collectionRes, tokenRes, userRes] = await Promise.all([fetch(collectionUrl), fetch(tokenUrl), fetch(userUrl)]);
    const [collectionData, tokenData, userData] = await Promise.all([collectionRes?.json(), tokenRes?.json(), userRes?.json()]);
    setSearchResults({ collections: collectionData, tokens: tokenData, users: userData });
    setIsLoading(false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (didMount && debouncedSearchTerm) {
      searchData();
    }
  }, [debouncedSearchTerm, didMount, searchData]);

  useEffect(() => {
    // reset state navigating to new route
    if (searchTerm || searchResults) {
      setSearchTerm('');
      setSearchResults(null);
    }

    if (isPopoverOpen === 'true') {
      buttonRef.current?.click(); // close popover on route change
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

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
                autoComplete="off"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={() => {
                  if (searchTerm && !open) {
                    buttonRef.current?.click(); // open popover on click
                  }
                }}
                onKeyUp={event => {
                  event.preventDefault();
                  if (searchTerm && !open) {
                    buttonRef.current?.click(); // open popover
                  }
                  if (!searchTerm && open) {
                    buttonRef.current?.click(); // close popover
                  }
                }}
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
              <Popover.Panel className="absolute z-10 w-[390px] -left-[56px] md:left-0 mt-[8px]">
                <div className="popover-container overflow-hidden rounded-[21px] text-manatee text-xs py-6 px-5">
                  {
                    !searchTerm || !searchResults || isLoading
                      ? (
                        <div className="w-full py-4 h-[325px] flex justify-center items-center">
                          {
                            !searchTerm 
                              ? <p>Please enter your search terms</p>
                              : <Spinner className="text-white w-[40px]" />
                          }
                        </div>
                      )
                      : (
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
                              <Collections results={searchResults?.collections?.results} />
                            </Tab.Panel>
                            <Tab.Panel as="dl">
                              <Items results={searchResults?.tokens?.results} />
                            </Tab.Panel>
                            <Tab.Panel as="dl">
                              <Profiles results={searchResults?.tokens?.results} />
                            </Tab.Panel>
                          </Tab.Panels>
                        </Tab.Group>
                      )
                  }
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
