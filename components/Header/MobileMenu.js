
import clsx from 'clsx';
import Link from 'next/link'
import Image from 'next/image'
import { Popover } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/outline'
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch';
import { ellipseAddress } from '../../Utils';

export default function MobileMenu(props) {
  const { navigation, connect, address, children } = props;

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

      <div className="mt-6 max-w-3xl mx-auto px-4 sm:px-6">
      {address ? (
        <div className="text-xs text-manatee mb-4">
          { children }
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
        >
          Connect
        </button>
      )}
      </div>
    </Popover.Panel>
  );
}