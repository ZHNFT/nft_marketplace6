import { useContext, useState } from "react";
import Image from "next/image";
import {
  LinkIcon,
  InstagramIcon,
  TwitterIcon,
  ShareIcon,
  EditIcon,
  BeeIcon,
  ChainIcon
} from "../icons";
import { getExplorer } from "../../config";
import { ellipseAddress, resolveBunnyLink } from "../../Utils";
import { formatEther, formatCompact } from "../../Utils/helper";
import SecondaryButton from "../Buttons/SecondaryButton";
import AppGlobalContext from "../../contexts/AppGlobalContext";
import DefaultLogo from "../../images/default-collection-logo.png";
import HNYicon from "../../images/icon-hny.png";
import AddCollectionModal from "../Modals/AddCollectionModal";
import PrimaryButton from "../Buttons/PrimaryButton";
import Web3Context from "../../contexts/Web3Context";

export default function ProfileHeader({
  chainIdHex,
  userData,
  address,
  total,
}) {
  const { setShowEditProfileModal } = useContext(AppGlobalContext);
  const {
    state: { tokenData },
  } = useContext(Web3Context);
  const tokenPriceUsd = tokenData?.priceUsd;

  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);

  return (
    <>
      <section className="lg:grid lg:grid-cols-12 flex relative text-white justify-between flex-col lg:flex-row mt-20 lg:mt-32 mb-28">

      <SecondaryButton
          className="flex items-center absolute  -top-[70px] text-xs font-medium"
          onClick={() => setShowEditProfileModal(true)}
        >
          <EditIcon className="w-[14px] mr-2" />
          Edit profile
        </SecondaryButton>
      
          <PrimaryButton
            className="flex items-center absolute right-0 -top-[70px] text-xs font-medium"
            onClick={() => setShowAddCollectionModal(true)}
          >
            Add collection
          </PrimaryButton>
        <AddCollectionModal
          isOpen={showAddCollectionModal}
          onClose={() => setShowAddCollectionModal(false)}
        />
          
        
        <div className="flex lg:col-span-7">
          <div className="mr-2.5">
            <div className="gradient-border relative p-2.5">
              <div className="rounded-full border border-white overflow-hidden w-[54px] h-[54px]">
                <Image
                  className="h-8 w-8"
                  src={resolveBunnyLink(userData?.images?.profile) || DefaultLogo}
                  alt="Profile photo"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl xl:text-6xl mb-2.5">
              {userData?.username || ellipseAddress(address, 4)}
            </h1>
            <ul className="flex justify-start items-center text-xs">
              <li className="mr-6">
                <a
                  href={
                    chainIdHex
                      ? `${getExplorer(chainIdHex)}address/${address}`
                      : `https://polygon-rpc.com/address/${address}`
                  } target="_blank" rel="noreferrer"
                  className="rounded pt-1 pb-0.5 px-2.5 bg-white bg-opacity-10"
                >
                  {ellipseAddress(address, 4)}

                  </a>

                </li>

                {userData?.website && (
                <li className="mr-6">
                  <a href={userData.website} target="_blank" rel="noreferrer">
                    <LinkIcon className="w-[18px] mr-2" />
                  </a>
                </li>
              )}
              {userData?.instagram && (
                <li className="mr-6">
                  <a href={userData.instagram} target="_blank" rel="noreferrer">
                    <InstagramIcon className="w-[18px] mr-2" />
                  </a>
                </li>
              )}
              {userData?.twitter && (
                <li className="mr-6">
                  <a href={userData.twitter} target="_blank" rel="noreferrer">
                    <TwitterIcon className="w-[19px] mr-2" />
                  </a>
                </li>
              )}
              {
                // <li>
                //   <a href="#">
                //     <span className="hidden">Share</span>
                //     <ShareIcon className="w-[14px]" />
                //   </a>
                // </li>
              }
            </ul>
          </div>
        </div>
        <div className="lg:col-span-5 mobile-only:mt-3 pt-1.5">
          <ul className="flex text-center justify-between">
            <li>
              <h4 className="text-xs mb-1.5">Items</h4>
              <span className="text-xl font-medium">{total}</span>
            </li>
            <li>
              <h4 className="text-xs mb-1.5">Transactions</h4>
              <span className="text-xl font-medium">
                { userData.sales?.total || 0 }
              </span>
            </li>
            <li>
              <h4 className="text-xs mb-1.5">Volume</h4>
              <span className="text-xl font-medium">
                <BeeIcon className="h-[17px] relative -top-[2px] pr-[5px]" />
                {userData.volume?.total
                  ? formatEther(userData.volume.total)
                  : 0}
              </span>
            </li>
            {/* <li>
              <h4 className="text-xs mb-1.5">Est. Value</h4>
              <span className="text-xl font-medium">
                ${userData.estimatedValue && tokenPriceUsd
                  ? formatCompact(
                      Number(formatEther(userData.estimatedValue)) *
                        Number(tokenPriceUsd)
                    )
                  : 0}
              </span>
            </li> */}
          </ul>
        </div>
      </section>
    </>
  );
}
