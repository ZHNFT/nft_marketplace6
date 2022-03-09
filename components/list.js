import { Fragment } from 'react';
import clsx from "clsx";
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FilterIcon, SearchIcon } from '@heroicons/react/solid';
import ListItem from './listItem';
import CollectionHeader from './collectionHeader';
import SortOptions from './sortOptions';

export default function List({ items, setMobileFiltersOpen, collection }) {
  console.log(`collection`, collection)
  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-8xl lg:px-8">
        <CollectionHeader 
          total={collection?.totalSupply}
          collectionName={collection?.name}
        />
        <div className="flex items-center justify-between space-x-4">
          <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
            <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <SortOptions />

            {/* <button type="button" className="p-2 -m-2 ml-5 sm:ml-7 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View grid</span>
              <ViewGridIcon className="w-5 h-5" aria-hidden="true" />
            </button> */}
            <button
              type="button"
              className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filters</span>
              <FilterIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {items?.map((item, index) => (
            <ListItem
              key={`item-${index}`}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}