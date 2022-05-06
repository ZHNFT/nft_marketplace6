
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
    <Popover.Panel as="nav" className="lg:hidden relative" aria-label="Global">
      <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
            className={clsx(
              'text-xl hover:bg-white/[0.05]',
              'block rounded-md py-2 px-3'
            )}
          >
            {item.name}
          </a>
        ))}
      </div>

      <div className={clsx(
        address ? 'flex justify-center mt-4 max-w-3xl mx-auto px-4 sm:px-6' : 'absolute right-6 top-2'
      )}>
      {address ? (
        <div className="text-xs text-manatee mb-4 w-full">
          { children }
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          className="mb-6 border dark:border-white border-ink rounded-full flex items-center py-2 px-8 focus:outline-none focus:ring-2 focus:ring-malibu text-sm dark:text-white"
        >
          Connect
        </button>
      )}
      </div>
    </Popover.Panel>
  );
}