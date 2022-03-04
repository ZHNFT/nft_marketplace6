
import clsx from 'clsx';
import Image from 'next/image'
import { Popover } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import DarkModeSwitch from '../darkModeSwitch';

export default function MobileMenu(props) {
  const { navigation, user, userNavigation, onClick, isAuthenticated } = props;

  return (
    <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
      <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
            className={clsx(
              item.current ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
              'block rounded-md py-2 px-3 text-base font-medium'
            )}
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
          <div className="flex-shrink-0">
            <Image className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" width={"40"} height={"40"} />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">{user.name}</div>
            <div className="text-sm font-medium text-gray-500">{user.email}</div>
          </div>
          <button
            type="button"
            className="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
          {userNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 max-w-3xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
        >
          Connect
        </button>

        <div className="mt-6 flex justify-center">
          <DarkModeSwitch />
          <a href="#" className="text-base font-medium text-gray-900 hover:underline">
            Some Link
          </a>
        </div>
      </div>
    </Popover.Panel>
  );
}