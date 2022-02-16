import { Fragment } from 'react';
import clsx from "clsx";
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FilterIcon, ViewGridIcon } from '@heroicons/react/solid';
import ListItem from './listItem';

export default function List({ items, sortOptions, setMobileFiltersOpen }) {
  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-8xl lg:px-8">
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-lg font-medium text-gray-900">Collection:</h2>
          {/* <a href="#" className="whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all<span aria-hidden="true"> &rarr;</span>
          </a> */}

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={clsx(
                              'block px-4 py-2 text-sm',
                              option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                              { 'bg-gray-100': active }
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

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
          {items?.map((item) => (
            <ListItem
              key={item.token_id}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}