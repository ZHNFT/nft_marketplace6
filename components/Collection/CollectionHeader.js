import { useState } from 'react';
import Image from 'next/image'
import { ellipseAddress } from '../../Utils';
import DefaultLogo from '../../images/default-collection-logo.png';
import { LinkIcon, InstagramIcon, TwitterIcon, ShareIcon, BeeIcon, EditIcon } from '../icons';
import { getExplorer } from '../../config';
import SecondaryButton from '../Buttons/SecondaryButton';
import EditCollectionModal from '../Modals/EditCollectionModal';

export default function CollectionHeader(props) {
  const { address, createdAt, name, description, logo, totalSupply, socials, chainIdHex } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <>
      <section className="lg:grid lg:grid-cols-12 flex relative text-white justify-between flex-col lg:flex-row mt-32 mb-28">
        <SecondaryButton
          className="flex items-center absolute right-0 -top-[70px] text-xs font-medium"
          onClick={() => setShowEditModal(true)}
        >
          <EditIcon className="w-[14px] mr-2" />
          Edit Collection
        </SecondaryButton>
        <div className="flex lg:col-span-7">
          <div className="mr-2.5">
            <div className="gradient-border relative p-2.5">
              <div className="rounded-full border border-white overflow-hidden w-[54px] h-[54px]">
                  <Image className="h-8 w-8" src={logo || DefaultLogo} alt={name} width={"100%"} height={"100%"} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl xl:text-6xl mb-2">{ name }</h1>
            <ul className="flex justify-start items-center text-xs">
                <li className="mr-6">
                    <a href={chainIdHex ? `${getExplorer(chainIdHex)}address/${address}` : `https://polygon-rpc.com/address/${address}`} className="rounded pt-1 pb-0.5 px-2.5 bg-white bg-opacity-10">
                      { ellipseAddress(address, 4) }
                      <LinkIcon className="w-[11px] ml-2 relative -top-[1px]" />
                    </a>
                </li>
                {
                  socials?.instagram && (
                    <li className="mr-6">
                      <a href="#">
                        <InstagramIcon className="w-[18px] mr-2" />
                        { socials.instagram }
                      </a>
                    </li>
                  )
                }
                {
                  socials?.twitter && (
                    <li className="mr-6">
                      <a href="#">
                        <TwitterIcon className="w-[19px] mr-2" />
                        { socials.twitter }
                      </a>
                    </li>
                  )
                }
                <li>
                    <a href="#">
                      <span className="hidden">Share</span>
                      <ShareIcon className="w-[14px]" />
                    </a>
                </li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-5 pt-1.5 lg:ml-8">
            <ul className="flex text-center justify-between">
                <li>
                    <h4 className="text-xs mb-1.5">Items</h4>
                    <span className="text-xl font-medium">{ totalSupply }</span>
                </li>
                <li>
                    <h4 className="text-xs mb-1.5">Owners</h4>
                    <span className="text-xl font-medium">36.1K</span>
                </li>
                <li>
                    <h4 className="text-xs mb-1.5">Volume</h4>
                    <span className="text-xl font-medium">
                      <BeeIcon className="w-[31px] relative -top-[3px]" />
                      16.7K
                    </span>
                </li>
                <li>
                    <h4 className="text-xs mb-1.5">Floor</h4>
                    <span className="text-xl font-medium">
                      <BeeIcon className="w-[31px] relative -top-[3px]" />
                      23
                    </span>
                </li>
            </ul>
        </div>
      </section>
      <EditCollectionModal
        isOpen={showEditModal}
        name={name}
        website=""
        instagram={socials?.instagram}
        twitter={socials?.twitter}
        discord={socials?.discord}
        telegram={socials?.telegram}
        description={description}
        payoutAddress={address}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}