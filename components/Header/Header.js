import { useContext } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { Popover } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import MobileMenu from "./MobileMenu";
import ProfileMenuButton from "./ProfileMenuButton";
import ProfileMenu from "./ProfileMenu";
import NotificationsButton from "./NotificationsButton";
import SearchInput from "./SearchInput";
import Logo from "../../images/hive-logo.png";
import EditProfileModal from "../Modals/EditProfileModal";
import AppGlobalContext from "../../contexts/AppGlobalContext";

export default function Header(props) {
  const { user, navigation, connect, disconnect, address, withBorder } = props;
  const { showEditProfileModal, setShowEditProfileModal } =
    useContext(AppGlobalContext);

  console.log(user);

  return (
    <>
      <Popover
        as="header"
        className={({ open }) =>
          clsx("relative lg:overflow-y-visible", {
            "fixed inset-0 z-40 overflow-y-auto": open,
            "border-b dark:border-header": withBorder,
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
                      <a className="flex items-center mr-[25px]">
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
                      <SearchInput />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block min-w-0 flex-1 md:px-8 lg:px-0 col-span-4">
                  <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                    <ul className="flex flex-1 justify-around">
                      <li>
                        <a href="#" className="text-base hover:underline">
                          Collections
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base hover:underline">
                          Marketplace
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base hover:underline">
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
                  <NotificationsButton />

                  {/* Profile dropdown */}
                  {address ? (
                    <ProfileMenuButton
                      address={address}
                      name={user?.name}
                      imageUrl={user?.imageUrl}
                      disconnect={disconnect}
                    >
                      <ProfileMenu
                        user={user}
                        address={address}
                        disconnect={disconnect}
                      />
                    </ProfileMenuButton>
                  ) : (
                    <button
                      type="button"
                      onClick={connect}
                      className="ml-5 border rounded-full flex items-center py-2 px-8 focus:outline-none focus:ring-2 focus:ring-malibu text-sm text-white"
                    >
                      Connect
                    </button>
                  )}
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
        name={user.name}
        imageUrl={user.imageUrl}
        website={user.website}
        instagram={user.instagram}
        twitter={user.twitter}
        description={user.description}
        onClose={() => setShowEditProfileModal(false)}
      />
    </>
  );
}
