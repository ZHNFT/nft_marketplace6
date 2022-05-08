import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Linkify from 'react-linkify';
import { resolveBunnyLink } from "../../Utils";
import { formatCompact, formatEther } from "../../Utils/helper";
import DefaultImage from '../../images/No-Image-Placeholder.png';
import HiveLogo from "../../images/collection-card-logo-hive.png";
import HiveImage from "../../images/collection-card-image-hive.png";
import PlaceholderImage from '../../images/placeholder-image.png';
import CurrencyIcon from "../CurrencyIcon/CurrencyIcon";

export default function CollectionCard({ collection, size }) {
  const { name, slug, tokens, pending, description, author, address, ownerCount, volume, floorPrice, totalSupply, images, categories, currency } = collection
  const totalVolume = volume?.total ? formatEther(volume?.total) : "0";
  const formattedFloorPrice = floorPrice ? formatEther(floorPrice) : "0";
  const collectionCategories = slug === 'hive' ? ['Utility'] : categories;
  const featuredImageWidth = size === 'sml' ? '480' : '555';
  const logoImage = images?.logo && images.logo.startsWith('ipfs:') ? `${resolveBunnyLink(images.logo)}?optimizer=image&width=76&aspect_ratio=1:1` : images?.logo;
  
  return (
   <div className={clsx(
     'relative mx-auto max-w-[378px] box-shadow-featuredCard rounded-xl dark:bg-[#262a32] border-[0.5px] dark:border-transparent border-manatee h-full',
     size === 'sml' ? 'md:max-w-[480px]' : 'md:max-w-[555px]'
   )}>
    <div className="relative w-[full] h-[300px] rounded-xl overflow-hidden">
      <Link href={`/collections/${address}`}>
        <a>
          {
            slug === 'hive' || images?.featured
              ? (
                <Image
                  className="block w-full object-center object-cover"
                  src={images?.featured ? `${resolveBunnyLink(images.featured)}?optimizer=image&width=${featuredImageWidth}&aspect_ratio=1:1` : HiveImage}
                  alt={name}
                  layout="fill" 
                />
              )
              : (
                <span className="flex justify-center items-center">
                  <span>
                    <Image className="h-8 w-8" src={PlaceholderImage} alt={name} width={67} height={75} />
                  </span>
                </span>
              )
          }
          <span className="sr-only">{ name }</span>
        </a>
      </Link>
      <div className="absolute text-white right-[12px] top-[12px] w-[66px] box-shadow-featuredCard backdrop-blur-md rounded-md bg-cardCaption py-1 px-2 flex flex-col">
        <ul>
          {
            tokens?.map((token, index) => (
              <li
                key={`${address}_${token.tokenId}`}
                className={clsx(
                  'relative w-[50px] h-[50px] my-2',
                  { 'hidden': index > 2 }
                )}
              >
                <Link href={`/collections/${address}/token/${token.tokenId}`}>
                  <a>
                    <Image
                      alt={token.name}
                      src={token.imageHosted ? `${resolveBunnyLink(token.imageHosted)}?optimizer=image&width=100&aspect_ratio=1:1` : DefaultImage}
                      className="rounded-md hover:brightness-110"
                      layout="fill"
                    />
                    <span className="sr-only">{ token.name }</span>
                  </a>
                </Link>
              </li>
            ))
          }
        </ul>
        <p className="mb-1 text-center leading-[1.5]">
          <span className="font-medium text-xs">{ totalSupply }</span>
          <span className="block text-manatee text-xxs">Items</span>
        </p>
      </div>
      <div className={clsx(
        'flex absolute bottom-0 left-0 pl-[60px] h-[46px] text-white w-full backdrop-blur-md text-xs justify-between items-center rounded-xl',
        pending === true ? 'blue-gradient opacity-85' : 'bg-cardCaption'
      )}>
        {
          pending === true
            ? (
              <span className="font-medium">Pending approval</span>
            )
            : (
              <>
                <div className="flex items-center flex-row text-center leading-[1.25] h-[35px] ml-6">
                  <span className="mr-3 font-light">Volume</span>
                  <span className="flex items-center relative -left-[6px]">
                    <CurrencyIcon currency={currency?.symbol} hnyClassName="h-[14px] -top-[0px] relative pr-[5px] -mr-1" />
                    <span className="font-medium ml-1">{totalVolume}</span>
                  </span>
                </div>
                <div className="pr-8 flex items-center flex-row text-center leading-[1.25] h-[35px] ml-4">
                  <span className="mr-3 font-light">Floor</span>
                  <span className="flex items-center relative -left-[6px]">
                    <CurrencyIcon currency={currency?.symbol} hnyClassName="h-[14px] relative -top-[0px] pr-[5px] -mr-1" />
                    <span className="font-medium ml-1">{ formattedFloorPrice }</span>
                  </span>
                </div>
              </>
            )
        }
      </div>
    </div>
    <div className="pt-2 px-5 pb-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={clsx(
            "absolute -top-[19px] left-[10px] w-[71px] h-[71px] rounded-full overflow-hidden flex items-center justify-center",
            "dark:bg-[#262a32] bg-white rounded-full before:block before:w-[71px] before:h-[71px] before:absolute before:left-0 before:top-0"
          )}>
            <div className="relative w-[55px] h-[55px] rounded-full overflow-hidden">
              <Image src={logoImage ? logoImage : HiveLogo} alt={name} layout="fill" />
            </div>
          </div>
          <div className="ml-[70px] leading-none">
            <h4 className="font-medium text-sm">{ name }</h4>
            <span className="text-manatee text-xs">{ author }</span>
          </div>
        </div>
        <div className="absolute -top-[287px] left-[12px] text-xxs">
          {
            collectionCategories?.map((category, index) => (
              <span key={`collection_category_${index}`} className="rounded-xl bg-tagDark text-white py-1 px-3">{ category }</span>
            ))
          }
          {/* <span className="rounded-xl bg-tagDark md:dark:bg-white/[0.05] md:bg-black/[0.05] py-1 px-3 ml-2">{ listed }% listed</span> */}
        </div>
      </div>
      <div className="flex flex-col mt-8 mb-1.5 lg:mb-12 align-center">
        <p className="dark:text-manatee text-ink text-xxs">
          <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="blank" className="dark:text-malibu text-cobalt hover:underline" href={decoratedHref} key={key}>
                  {decoratedText}
              </a>
          )}>
            {description}
          </Linkify>
        </p>
      </div>
    </div>
    <div className="hidden lg:block absolute right-4 bottom-5">
      <Link href={`/collections/${address}`}>
        <a className="whitespace-nowrap font-medium text-xs rounded-[10px] py-2 px-4 border-[0.5px] border-transparent bg-white/[0.05] dark:border-white border-cobalt dark:hover:border-cornflower dark:hover:bg-white/[0.15] hover:bg-cornflower/[0.15]">
          View collection
        </a>
      </Link>
    </div>
   </div>
  );
}
