import Image from 'next/image';
import Linkify from 'react-linkify';
import { resolveBunnyLink } from '../../Utils';
import { InstagramIcon, TwitterIcon, ChainIcon } from '../icons';
import CurrencyIcon from '../CurrencyIcon/CurrencyIcon';
import DefaultLogo from '../../images/default-collection-logo.png';

export default function ProductCollection({name, logo, collectionId, currency, itemCount, ownerCount, volume, floorPrice, instagram, twitter, website, description }) {
  const logoImage = logo && logo.startsWith('ipfs:') ? `${resolveBunnyLink(logo)}?optimizer=image&width=26&aspect_ratio=1:1` : logo;
  return (
    <div>
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center">
          <span className="inline-block rounded-full overflow-hidden w-[26px] h-[26px]  mr-1.5">
            <Image
              className="h-8 w-8 bg-white"
              src={logoImage || DefaultLogo}
              alt={name}
              width={"100%"}
              height={"100%"}
            />
          </span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex items-center dark:text-manatee text-frost shrink-0 ml-1 mr-2">
          {
            instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-cornflower" >
                <span className="sr-only">Instagram</span>
                <InstagramIcon className="w-[16px]" />
              </a>  
            )
          }

          {
            twitter && (
              <a href={twitter} target="_blank" rel="noreferrer" className="ml-4 hover:text-cornflower">
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="w-[18px]" />
              </a>  
            )
          }

          {
            website && (
              <a href={website} target="_blank" rel="noreferrer" className="ml-4 hover:text-cornflower">
                <span className="sr-only">Website</span>
                <ChainIcon className="w-[13px]" />
              </a>  
            )
          }
        </div>
      </div>
      <div className="max-h-[200px] mt-4 overflow-y-scroll">
        <div className="flex items-top justify-between mx-4 text-center">
          <div>
            <span className="dark:text-manatee text-frost text-xs font-medium">Items</span>
            <span className="block text-base font-medium">{ itemCount }</span> 
          </div>
          <div>
            <span className="dark:text-manatee text-frost text-xs font-medium">Owners</span>
            <span className="block text-base font-medium">{ ownerCount }</span> 
          </div>
          <div className="relative">
            <span className="dark:text-manatee text-frost text-xs font-medium">Volume</span>
            <span className="block flex items-center justify-center text-base font-medium">
              <CurrencyIcon currency={currency} hnyClassName="h-[14px] relative pr-[5px] -mr-1" />
              <span className="ml-1">{ volume ? volume : "0" }</span>
            </span> 
            <span className="dark:text-manatee text-frost text-xxs absolute block flex w-[74px]">Last 30 days</span>
          </div>
          <div>
            <span className="dark:text-manatee text-frost text-xs font-medium">Floor</span>
            <span className="block flex items-center justify-center text-base font-medium">
             <CurrencyIcon currency={currency} hnyClassName="h-[14px] relative pr-[5px] -mr-1" />
             <span className="ml-1">{ floorPrice ? floorPrice : "0" }</span>
            </span> 
          </div>
        </div>
        <div className="text-xxs dark:text-manatee text-frost mt-8">
          <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="blank" className="dark:text-malibu text-cobalt hover:underline" href={decoratedHref} key={key}>
                  {decoratedText}
              </a>
          )}>
            {description}
          </Linkify>
        </div>
      </div>
    </div>
  );
};