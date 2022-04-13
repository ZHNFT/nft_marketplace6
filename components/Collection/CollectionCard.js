import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { resolveBunnyLink } from "../../Utils";
import { formatCompact, formatEther } from "../../Utils/helper";
import DefaultImage from '../../images/No-Image-Placeholder.png';
import HiveLogo from "../../images/collection-card-logo-hive.png";
import HiveImage from "../../images/collection-card-image-hive.png";
import PlaceholderImage from '../../images/placeholder-image.png';
import { BeeIcon, ViewIcon } from "../icons";

export default function CollectionCard({ collection, size }) {
  const { name, slug, tokens, pending, description, author, address, ownerCount, volume, floorPrice, totalSupply, images, categories } = collection
  const totalVolume = volume?.total ? formatEther(volume?.total) : "0";
  const formattedFloorPrice = floorPrice ? formatEther(floorPrice) : "0";
  const collectionCategories = slug === 'hive' ? ['Utility'] : categories;
  const featuredImageWidth = size === 'sml' ? '480' : '555';

  return (
   <div className={clsx(
     'mx-auto max-w-[378px] box-shadow-featuredCard rounded-xl bg-[#262a32] h-full',
     size === 'sml' ? 'md:max-w-[480px]' : 'md:max-w-[555px]'
   )}>
    <div className="relative w-[full] h-[300px] md:h-[439px] rounded-xl overflow-hidden">
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
      <div className="absolute right-[12px] top-[12px] md:right-[18px] md:top-[18px] w-[66px] box-shadow-featuredCard backdrop-blur-md rounded-md bg-cardCaption py-1 px-2 flex flex-col">
        <ul>
          {
            tokens?.map((token, index) => (
              <li
                key={`${address}_${token.tokenId}`}
                className={clsx(
                  'relative w-[50px] h-[50px] my-2',
                  { 'hidden md:block': index > 2 }
                )}
              >
                <Link href={`/collections/${address}/token/${token.tokenId}`}>
                  <a>
                    <Image
                      alt={token.name}
                      src={token.imageHosted ? `${resolveBunnyLink(token.imageHosted)}?optimizer=image&width=100&aspect_ratio=1:1` : DefaultImage}
                      className="rounded-md"
                      layout="fill"
                    />
                    <span className="sr-only">{ token.name }</span>
                  </a>
                </Link>
              </li>
            ))
          }
        </ul>
        <p className="md:mt-1 mb-1 md:mb-2 text-center leading-[1.5]">
          <span className="font-medium text-xs">{ totalSupply }</span>
          <span className="block text-manatee text-xxs">Items</span>
        </p>
      </div>
      <div className={clsx(
        'flex absolute bottom-0 left-0 h-[46px] w-full backdrop-blur-md text-sm justify-center items-center rounded-xl',
        pending === true ? 'blue-gradient opacity-85' : 'bg-cardCaption md:justify-between'
      )}>
        {
          pending === true
            ? (
              <span className="font-medium">Pending approval</span>
            )
            : (
              <>
                <div className="ml-6 md:ml-[130px] flex flex-col md:flex-row text-center md:text-left leading-[1.25]">
                  <span className="font-light">Owners</span>
                  <span className="font-medium ml-2">{ formatCompact(ownerCount) }</span>
                </div>
                <div className="flex items-center flex-col md:flex-row text-center md:text-left leading-[1.25] h-[35px] ml-6">
                  <span className="mr-1 font-light">Volume</span>
                  <span className="flex items-center relative -top-[4px] -left-[6px] md:top-auto md:left-auto">
                    <BeeIcon className="h-[14px] relative -top-[1px] pr-[5px]" />
                    <span className="font-medium">{totalVolume}</span>
                  </span>
                </div>
                <div className="mr-8 flex items-center flex-col md:flex-row text-center md:text-left leading-[1.25] h-[35px] ml-6">
                  <span className="mr-1 font-light">Floor</span>
                  <span className="flex items-center relative -top-[4px] -left-[6px] md:top-auto md:left-auto">
                    <BeeIcon className="h-[14px] relative -top-[1px] pr-[5px]" />
                    <span className="font-medium">{ formattedFloorPrice }</span>
                  </span>
                </div>
              </>
            )
        }
      </div>
    </div>
    <div className="pt-2 md:pt-4 px-5 pb-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={clsx(
            "absolute -top-[19px] left-[10px] md:-top-[34px] md:left-[14px] w-[71px] h-[71px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden flex items-center justify-center",
            "bg-[#262a32] rounded-full before:block before:w-[71px] before:h-[71px] md:before:w-[100px] md:before:h-[100px] before:absolute before:left-0 before:top-0"
          )}>
            <div className="relative w-[55px] h-[55px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden">
              <Image src={HiveLogo} alt={name} layout="fill" />
            </div>
          </div>
          <div className="ml-[70px] md:ml-[102px] leading-none">
            <h4 className="font-medium text-sm">{ name }</h4>
            <span className="text-manatee text-xs">{ author }</span>
          </div>
        </div>
        <div className="absolute -top-[287px] left-[12px] md:relative md:top-auto md:left-auto text-xxs">
          {
            collectionCategories?.map((category, index) => (
              <span key={`collection_category_${index}`} className="rounded-xl bg-tagDark md:dark:bg-white/[0.05] md:bg-black/[0.05] py-1 px-3">Utility</span>
            ))
          }
          {/* <span className="rounded-xl bg-tagDark md:dark:bg-white/[0.05] md:bg-black/[0.05] py-1 px-3 ml-2">{ listed }% listed</span> */}
        </div>
      </div>
      <div className="flex mt-8 mb-1.5 align-center">
        <p className="text-manatee text-xxs mr-8">
          { description }
        </p>
        <div className="hidden md:block">
          <Link href={`/collections/${address}`}>
            <a className="whitespace-nowrap font-medium text-xs rounded-[10px] py-2 px-4 border-[0.5px] border-transparent bg-white/[0.05] border-white hover:border-cornflower hover:bg-white/[0.15]">
              View collection
            </a>
          </Link>
        </div>
      </div>
    </div>
   </div>
  );
}
