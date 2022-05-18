import { useState, useContext, Fragment } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Menu, Transition, Popover } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import MobileMenu from "./MobileMenu";
import ProfileMenuButton from "./ProfileMenuButton";
import ProfileMenu from "./ProfileMenu";
import NotificationsButton from "./NotificationsButton";
import SearchInput from "./SearchInput";
import Logo from "../../images/hive-logo.png";
import EditProfileModal from "../Modals/EditProfileModal";
import AppGlobalContext from "../../contexts/AppGlobalContext";
import { MenuIcon } from "../icons";
import ChainSwitcher from './ChainSwitcher';
import AddCollectionModal from "../Modals/AddCollectionModal";

export default function Header(props) {
  const router = useRouter();
  const { navigation, connect, disconnect, address, withBorder } = props;
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const { showEditProfileModal, setShowEditProfileModal, user } =
    useContext(AppGlobalContext);

  return (
    <>
      <Popover
        as="header"
        className={({ open }) =>
          clsx("relative lg:overflow-y-visible shadow-md", {
            "fixed inset-0 z-40 overflow-y-auto": open
          })
        }
      >
        {({ open }) => (
          <>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8 py-2">
                <div className="flex md:inset-y-0 lg:static col-span-4">
                  <div className="flex-shrink-0 flex items-center w-full">
                    <Link href="/">
                      <a className="flex items-center mr-[25px]">
                        <span className="dark:bg-logo-white bg-logo-blue bg-cover w-[32px] h-[36px]" />
                        <span className="font-medium text-[1.4rem] ml-3">Hexagon</span>
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:block min-w-0 flex-1 md:px-8 lg:px-0 col-span-4">
                  <div className="flex items-center px-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                    <div className="w-full">
                      <SearchInput />
                    </div>
                  </div>
                </div>
                <div className="flex lg:items-center lg:justify-end xl:col-span-4 justify-between lg:w-auto">
                  <ul className="hidden lg:flex ml-4 mr-2 flex-1 justify-end">
                    <li>
                      <Menu as="div" className="z-10 relative inline-block text-left">
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center items-center text-base hover:underline">
                            Collections
                            <ChevronDownIcon
                              className="ml-2 -mr-1 h-5 w-5"
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
                          <Menu.Items className="popover-container absolute py-1.5 right-0 mt-2 w-32 origin-top-right rounded-[21px]">
                            <div>
                              <Menu.Item>
                                <button
                                  className="text-base dark:bgdark:hover:text-cornflower hover:text-cobalt px-4 py-2 w-full text-center"
                                  onClick={() => router.push('/collections')}
                                >
                                  Explore
                                </button>
                              </Menu.Item>
                            </div>
                            <div>
                              <Menu.Item>
                                <button
                                  className="text-base dark:hover:text-cornflower hover:text-cobalt px-4 py-2 w-full text-center"
                                  onClick={() => setShowAddCollectionModal(true)}
                                >
                                  Apply
                                </button>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </li>
                  </ul>

                  {
                    address && <NotificationsButton currentUserAddress={address} />
                  }

                  <div className="hidden lg:block">
                  {/* Profile dropdown */}
                  {address ? (
                    <ProfileMenuButton
                      address={address}
                      name={user?.username}
                      imageUrl={user?.images?.profile}
                      disconnect={disconnect}
                    >
                      <ProfileMenu
                        address={address}
                        disconnect={disconnect}
                      />
                    </ProfileMenuButton>
                  ) : (
                    <button
                      type="button"
                      onClick={connect}
                      className="ml-5 border dark:border-white border-ink rounded-full flex items-center py-2 px-8 focus:outline-none focus:ring-2 focus:ring-malibu text-sm dark:text-white text-ink"
                    >
                      Connect
                    </button>
                  )}
                  </div>

                  <div className="flex items-center md:inset-y-0 lg:hidden xl:col-span-4">
                    {/* Mobile menu button */}
                    <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center">
                      <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                      <MenuIcon className={clsx('block h-6 w-6', open ? 'text-pitch dark:text-white' : 'text-manatee')} aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
              </div>
            </div>
            <MobileMenu
              navigation={navigation}
              connect={connect}
              address={address}
              onClickApply={() => setShowAddCollectionModal(true)}
            >
              <ProfileMenu
                user={user}
                address={address}
                disconnect={disconnect}
              />
            </MobileMenu>
          </>
        )}
      </Popover>
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
      <AddCollectionModal
        isOpen={showAddCollectionModal}
        onClose={() => setShowAddCollectionModal(false)}
      />
    </>
  );
}
