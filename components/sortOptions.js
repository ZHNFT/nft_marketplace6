import { Fragment } from 'react';
import clsx from "clsx";
import { stringify, parse } from 'qs';
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid';

const sortOptions = [
  { name: 'Most Popular', sortBy: '#', current: true },
  { name: 'Best Rating', sortBy: '#', current: false },
  { name: 'Newest', sortBy: '#', current: false },
  { name: 'Price: Low to High', sortBy: '-lowestPrice', current: false },
  { name: 'Price: High to Low', sortBy: '-highestPrice', current: false },
  { name: 'Bids: High to Low', sortBy: '-highestBid', current: false },
]

export default function SortOptions(props) {
  const { push, query, pathname } = useRouter();
  const { address, search } = query;

  function handleSubmit(value) {
    const newQuery = {
      address,
      ...query,
      sort: value
    };

    push({
      pathname: `${pathname}`,
      query: newQuery,
    });
  }

  return (
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
                <button
                  type="button"
                  onClick={() => handleSubmit(option.sortBy)}
                  className={clsx(
                    'block px-4 py-2 text-sm',
                    option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                    { 'bg-gray-100': active }
                  )}
                >
                  {option.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
  )
}