import { useContext } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { Popover } from "@headlessui/react";
import MobileMenu from "./MobileMenu";
import ProfileMenuButton from "./ProfileMenuButton";
import ProfileMenu from "./ProfileMenu";
import NotificationsButton from "./NotificationsButton";
import SearchInput from "./SearchInput";
import Logo from "../../images/hive-logo.png";
import EditProfileModal from "../Modals/EditProfileModal";
import AppGlobalContext from "../../contexts/AppGlobalContext";
import { MenuIcon } from "../icons";

export default function Header(props) {
  const { navigation, connect, disconnect, address, withBorder } = props;
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
                        <span className="font-medium text-lg ml-3">Hexagon</span>
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:block min-w-0 flex-1 md:px-8 lg:px-0 col-span-4">
                  <div className="flex items-center px-6 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                    <div className="w-full">
                      <SearchInput />
                    </div>
                  </div>
                </div>
                <div className="flex lg:items-center lg:justify-end xl:col-span-4 justify-between lg:w-auto">
                  <ul className="hidden lg:flex ml-4 flex-1 justify-around">
                    <li>
                      <Link href="/collections">
                        <a className="text-base hover:underline">
                          Collections
                        </a>
                      </Link>
                    </li>
                  </ul>

                  <NotificationsButton currentUserAddress={address} />

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
    </>
  );
}
