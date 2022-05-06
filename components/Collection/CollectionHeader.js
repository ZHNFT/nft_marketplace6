import { useState } from 'react';
import Image from 'next/image'
import { ellipseAddress, resolveBunnyLink } from '../../Utils';
import { formatEther } from '../../Utils/helper';
import DefaultLogo from '../../images/default-collection-logo.png';
import { LinkIcon, InstagramIcon, TwitterIcon, ShareIcon, EditIcon, DiscordIcon, TelegramIcon } from '../icons';
import CurrencyIcon from '../CurrencyIcon/CurrencyIcon';
import { getExplorer } from '../../config';
import SecondaryButton from '../Buttons/SecondaryButton';
import EditCollectionModal from '../Modals/EditCollectionModal';

export default function CollectionHeader(props) {
  const { address, createdAt, currency, name, description, logo, totalSupply, socials, chainIdHex, floorPrice, ownerCount, volume } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const logoImage = logo && logo.startsWith('ipfs:') ? `${resolveBunnyLink(logo)}?optimizer=image&width=54&aspect_ratio=1:1` : logo;

  return (
    <>
      <section className="lg:grid lg:grid-cols-12 flex relative dark:text-white justify-between flex-col lg:flex-row mt-8 mb-16">
       
        <SecondaryButton
          className="hidden flex items-center absolute right-0 -top-[70px] text-xs font-medium"
          onClick={() => setShowEditModal(true)}
        >
          <EditIcon className="w-[14px] mr-2" />
          Edit collection
        </SecondaryButton>
        <div className="flex lg:col-span-7">
          <div className="mr-2.5">
            <div className="gradient-border relative p-2.5">
              <div className="rounded-full border border-white overflow-hidden w-[54px] h-[54px]">
                  <Image
                    className="h-8 w-8"
                    src={logoImage || DefaultLogo}
                    alt={name}
                    width={"100%"}
                    height={"100%"}
                  />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl xl:text-6xl mb-2">{ name }</h1>
            <ul className="flex justify-start items-center text-xs pt-1">
                <li className="mr-6">
                    <a href={chainIdHex ? `${getExplorer(chainIdHex)}address/${address}` : `https://polygon-rpc.com/address/${address}`} 
                      className="rounded pt-1 pb-0.5 px-2.5 dark:bg-white bg-opacity-10 bg-ink">
                      { ellipseAddress(address, 4) }
                      <LinkIcon className="w-[11px] ml-2 relative -top-[1px]" />
                    </a>
                </li>
                {
                  socials?.instagram && (
                    <li className="mr-6">
                      <a href={socials.instagram} target="_blank" rel="noreferrer" >
                        <InstagramIcon className="w-[18px] mr-2 dark:text-white text-frost" />
                      </a>
                    </li>
                  )
                }
                {
                  socials?.twitter && (
                    <li className="mr-6">
                      <a href={socials.twitter} target="_blank" rel="noreferrer">
                        <TwitterIcon className="w-[19px] mr-2 dark:text-white text-frost" />
                      </a>
                    </li>
                  )
                }
                 {
                  socials?.discord && (
                    <li className="mr-6">
                      <a href={socials.discord} target="_blank" rel="noreferrer">
                        <DiscordIcon className="w-[19px] mr-2 dark:text-white text-frost" />
                      </a>
                    </li>
                  )
                }
                {
                  socials?.telegram && (
                    <li className="mr-6">
                      <a href={socials.telegram} target="_blank" rel="noreferrer">
                        <TelegramIcon className="w-[19px] mr-2 dark:text-white text-frost" />
                      </a>
                    </li>
                  )
                }
                 {
                  socials?.website && (
                    <li className="mr-6">
                      <a href={socials.website} target="_blank" rel="noreferrer">
                        <LinkIcon className="w-[19px] mr-2 dark:text-white text-frost" />
                      </a>
                    </li>
                  )
                }
                <li>
                    <a href="#">
                      <span className="hidden">Share</span>
                      {/*<ShareIcon className="w-[14px]" />*/}
                    </a>
                </li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-5 mobile-only:mt-3 pt-1.5 lg:ml-8">
            <ul className="flex text-center justify-between">
                <li>
                    <h4 className="text-xs mb-1.5">Items</h4>
                    <span className="text-xl font-medium">{ totalSupply }</span>
                </li>
                <li>
                    <h4 className="text-xs mb-1.5">Owners</h4>
                    <span className="text-xl font-medium">{ownerCount}</span>
                </li>
                <li>
                    <h4 className="text-xs mb-1.5">Volume</h4>
                    <span className="text-xl font-medium">
                      <CurrencyIcon currency={currency} hnyClassName="h-[18px] relative -top-[2px] pr-[5px] -mr-1" ethWidth={13} ethHeight={17} />
                      <span className="ml-1">{volume ? formatEther(volume) : "0"}</span>
                    </span>
                </li>
                <li>
                    <h4 className="text-xs mb-1.5">Floor</h4>
                    <span className="text-xl font-medium">
                      <CurrencyIcon currency={currency} hnyClassName="h-[18px] relative -top-[2px] pr-[5px] -mr-1" ethWidth={13} ethHeight={17} />
                      <span className="ml-1">{floorPrice ? formatEther(floorPrice) : "0"}</span>
                    </span>
                </li>
            </ul>
            <p className='dark:text-manatee text-frost text-xs pt-3'>{description}</p>
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