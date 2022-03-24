import Link from "next/link";
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
import DarkModeSwitch from "./DarkModeSwitch";
import { GetNumberTokens } from "../../Utils/web3HelperFunctions";
import { useState, useEffect } from "react";
import { makeCancelable } from "../../Utils/helper";

export default function ProfileMenu({ address, disconnect }) {
  const [hnyBalance, setHnyBalance] = useState([]);

  useEffect(() => {
    const balanceRequest = makeCancelable(GetNumberTokens());

    balanceRequest
      .then((balance) => setHnyBalance(balance))
      .catch((e) => {
        console.log("req cancelled: ", e);
      });

    return function cleanup() {
      balanceRequest.cancel();
    };
  }, []);

  return (
    <>
      <h4 className="font-medium">Current balance</h4>
      <div className="relative mt-2 mb-10 flex justify-between after:block after:m-auto after:w-[98%] after:absolute after:left-0 after:right-0 after:border-b-[0.5px] after:border-silver after:-bottom-[14px]">
        <div>
          <span className="font-medium text-white text-base">
            {hnyBalance > 0 ? hnyBalance : 0} HNY
          </span>
          <button
            className="block hover:text-white"
            type="button"
            onClick={() => navigator.clipboard.writeText(address)}
          >
            <span className="text-xxs">{ellipseAddress(address, 4)}</span>
            <CopyIcon className="w-[10px] ml-2" />
          </button>
        </div>
        <div>
          <div className="text-right flex items-center justify-end">
            <button type="button" className="hover:text-white">
              <span className="sr-only">Refresh</span>
              <RefreshIcon className="w-[13px]" />
            </button>
            <button type="button" className="ml-2.5 hover:text-white">
              <span className="sr-only">Add</span>
              <PlusIcon className="w-[14px]" />
            </button>
          </div>
          <button
            type="button"
            onClick={disconnect}
            className="text-cornflower mt-1.5"
          >
            Disconnect
          </button>
        </div>
      </div>

      <h4 className="font-medium mb-3">Account</h4>
      <ul>
        <li className="my-3">
          <Link href={`/users/[address]`} as={`/users/${address}`} passHref>
            <a className="flex items-center hover:text-white">
              <ProfileIcon className="w-[12px]" />
              <span className="text-white ml-4">My portfolio</span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <button type="button" className="flex items-center hover:text-white">
            <EditIcon className="w-[12px]" />
            <span className="text-white ml-4">Edit profile</span>
          </button>
        </li>
        <li className="my-3">
          <Link
            href={`/users/[address]?tab=activity`}
            as={`/users/${address}?tab=activity`}
            passHref
          >
            <a className="flex items-center hover:text-white">
              <FolderIcon className="w-[14px]" />
              <span className="text-white ml-4">Activity</span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <Link href="#" passHref>
            <a className="flex items-center hover:text-white">
              <ReceiveIcon className="w-[17px] relative -left-[1px]" />
              <span className="text-white ml-4">Offers</span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <Link href="#" passHref>
            <a className="flex items-center hover:text-white">
              <FilesIcon className="w-[14px]" />
              <span className="text-white ml-4">My collections</span>
            </a>
          </Link>
        </li>
      </ul>

      <div className="mt-4 text-right">
        <DarkModeSwitch />
      </div>
    </>
  );
}
