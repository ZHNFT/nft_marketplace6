import { Fragment, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link'
import Image from 'next/image'
import { useMoralis } from 'react-moralis';
import { Menu, Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, BellIcon } from '../icons';
import DarkModeSwitch from '../darkModeSwitch';
import MobileMenu from './MobileMenu';
import AuthModal from './AuthModal';
import Logo from '../../images/hive-logo.png';

export default function Header(props) {
  const { user, navigation, userNavigation } = props;
  const { authenticate, isAuthenticated, user: moralisUser, account, chainId, logout } = useMoralis();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  console.log(`account`, account)
  console.log(`chainId`, chainId)

  function handleOpenAuthModal() {
    setIsAuthModalVisible(true)
  }

  function handleCloseAuthModal() {
    setIsAuthModalVisible(false)
  }

  return (
    <>
      <AuthModal
        handleClose={handleCloseAuthModal}
        open={isAuthModalVisible}
        authenticate={authenticate}
      />
      <Popover
        as="header"
        className={({ open }) =>
          clsx('relative bg-gradient-to-b from-[#4e7283] to-[#517687] border-b border-[#bac8cf] lg:overflow-y-visible', {
            'fixed inset-0 z-40 overflow-y-auto': open
          })
        }
      >
        {({ open }) => (
          <>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                <div className="flex md:inset-y-0 lg:static col-span-4">
                  <div className="flex-shrink-0 flex items-center w-full">
                    <Link href="/">
                      <a className='flex items-center mr-[25px]'>
                        <Image
                          className="block h-8 w-auto"
                          src={Logo}
                          alt="Hive Investments"
                          width="34"
                          height="38"
                        />
                      </a>
                    </Link>
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <input
                          id="search"
                          name="search"
                          className="block w-full bg-gradient-to-r from-[#608293] to-[#748e9b] lg:max-w-[268px] rounded-full py-2 pl-4 pr-3 border-transparent text-sm placeholder-white focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-malibu focus:border-malibu sm:text-sm"
                          placeholder="Explore"
                          type="search"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 col-span-4">
                  <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                    <ul className="flex flex-1 justify-around">
                      <li>
                        <a href="#" className="text-base text-white hover:underline">
                          Collections
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base text-white hover:underline">
                          Marketplace
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base text-white hover:underline">
                          Drops
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden xl:col-span-4">
                  {/* Mobile menu button */}
                  <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-malibu">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  <DarkModeSwitch />
                  <a
                    href="#"
                    className="ml-5 flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-malibu"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="text-white w-[25px] pb-1.5" />
                  </a>

                  {/* Profile dropdown */}
                  <Menu as="div" className="flex-shrink-0 relative ml-5">
                    <div>
                      <Menu.Button className="border rounded-full flex items-center p-1 focus:outline-none focus:ring-2 focus:ring-malibu">
                        <span className="sr-only">Open user menu</span>
                        <Image className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" width={"27"} height={"27"} />
                        <span className="text-xs text-white pr-2 pl-2">{ user.name }</span>
                        <ChevronDownIcon className="w-[16px] text-white pr-1" />
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
                      <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                        <Menu.Item key="wallet">
                          {isAuthenticated ? (
                            <span>{account}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleOpenAuthModal}
                              className="w-full text-left block py-2 px-4 text-sm text-gray-700"
                            >
                              Connect
                            </button>
                          )}
                        </Menu.Item>
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={clsx(
                                  'block py-2 px-4 text-sm text-gray-700',
                                  { 'bg-gray-100': active }
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <MobileMenu
              navigation={navigation}
              user={user}
              userNavigation={userNavigation}
              onClick={handleOpenAuthModal}
              isAuthenticated={isAuthenticated}
            />
          </>
        )}
      </Popover>
    </>
  );
}