import Link from "next/link";
import { useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import { ellipseAddress } from "../../Utils";
import {
  CopyIcon,
  EditIcon,
  PlusIcon,
  ProfileIcon,
  RefreshIcon,
  FolderIcon,
  ReceiveIcon,
  FilesIcon,
} from "../icons";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch";
import AppGlobalContext from "../../contexts/AppGlobalContext";
import { CHAINS } from "../../constants/chains";

export default function ProfileMenu({ address, disconnect }) {
  const { user, setShowEditProfileModal } = useContext(AppGlobalContext);
  const {
    state: { tokenBalance, chainId },
  } = useContext(Web3Context);

  let balance = tokenBalance;

  if(balance) {

    if(typeof(balance) == "string") {

      balance = parseFloat(balance);

      balance = balance.toFixed(2);

    }

  } else {

    balance = "0"

  }
  
  return (
    <div className="dark:text-manatee text-ink">
      <h4 className="font-medium">Current balance</h4>
      <div className="relative mt-2 mb-10 flex justify-between after:block after:m-auto after:w-[98%] after:absolute after:left-0 after:right-0 after:border-b-[0.5px] after:border-silver after:-bottom-[14px]">
        <div>
          <span className="font-medium text-base text-pitch dark:text-white">
            {balance} { CHAINS[chainId]?.mainTokenTicker }
          </span>
          <button
            className="block dark:hover:text-white hover:text-cobalt"
            type="button"
            onClick={() => navigator.clipboard.writeText(address)}
          >
            <span className="text-xxs">{ellipseAddress(address, 4)}</span>
            <CopyIcon className="w-[10px] ml-2" />
          </button>
        </div>
        <div>
          <div className="text-right flex items-center justify-end">
            <button type="button" className="dark:hover:text-white hover:text-cobalt">
              <span className="sr-only">Refresh</span>
              <RefreshIcon className="w-[13px]" />
            </button>
            <button type="button" className="ml-2.5 dark:hover:text-white hover:text-cobalt">
              <span className="sr-only">Add</span>
              <PlusIcon className="w-[14px]" />
            </button>
          </div>
          <button
            type="button"
            onClick={disconnect}
            className="dark:text-cornflower text-cobalt hover:underline mt-1.5"
          >
            Disconnect
          </button>
        </div>
      </div>

      <h4 className="font-medium mb-3">Account</h4>
      <ul>
        <li className="my-3">
          <Link href={`/users/[address]`} as={`/users/${address}`} passHref>
            <a className="flex items-center dark:hover:text-white hover:text-cobalt">
              <ProfileIcon className="w-[12px]" />
              <span className="dark:text-white ml-4">My portfolio</span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <button
            type="button"
            className="flex items-center dark:hover:text-white hover:text-cobalt"
            onClick={() => {
              setShowEditProfileModal(true);
            }}
          >
            <EditIcon className="w-[12px]" />
            <span className="dark:text-white ml-4">Edit profile</span>
          </button>
        </li>
        <li className="my-3">
          <Link
            href={`/users/[address]?tab=activity`}
            as={`/users/${address}?tab=activity`}
            passHref
          >
            <a className="flex items-center dark:hover:text-white hover:text-cobalt">
              <FolderIcon className="w-[14px]" />
              <span className="dark:text-white ml-4">Activity</span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <Link
            href={`/users/[address]?tab=offers`}
            as={`/users/${address}?tab=offers`}
            passHref
          >
            <a className="flex items-center dark:hover:text-white hover:text-cobalt">
              <ReceiveIcon className="w-[17px] relative -left-[1px]" />
              <span className="dark:text-white ml-4">Offers</span>
            </a>
          </Link>
        </li>

        {/*<li className="my-3">
          <Link
            href={`/users/[address]?tab=collections`}
            as={`/users/${address}?tab=collections`}
            passHref
          >
            <a className="flex items-center dark:hover:text-white">
              <FilesIcon className="w-[14px]" />
              <span className="dark:text-white ml-4">My collections</span>
            </a>
          </Link>
          </li>*/}

      </ul>
      
      <div className="mt-4 text-right">
        <DarkModeSwitch />
      </div>
    </div>
  );
}
