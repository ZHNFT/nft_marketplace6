
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
              'text-white text-xl hover:bg-white/[0.05]',
              'block rounded-md py-2 px-3'
            )}
          >
            {item.name}
          </a>
        ))}
      </div>

      <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6">
      {address ? (
        <div className="text-xs text-manatee mb-4">
          { children }
        </div>
      ) : (
        <button
          type="button"
          onClick={connect}
          className="text-cornflower mb-6"
        >
          Connect
        </button>
      )}
      </div>
    </Popover.Panel>
  );
}