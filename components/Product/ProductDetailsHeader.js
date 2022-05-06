import Link from 'next/link';
import Image from 'next/image';
import { ellipseAddress, resolveBunnyLink } from '../../Utils';
import { RefreshIcon, ShareIcon } from '../icons';
import DefaultLogo from '../../images/default-collection-logo.png';
import ItemPrice from '../ItemPrice/ItemPrice';
import ProgressHexagon from '../ProgressHexagon/ProgressHexagon';

export default function ProductDetailsHeader(props) {
  const { className, collection, name, owner, isOwner, address, rarity, maxRarity, lastSalePrice, refreshMetaData } = props;
  const logoImage = collection?.logo && collection.logo.startsWith('ipfs:') ? `${resolveBunnyLink(collection?.logo)}?optimizer=image&width=26&aspect_ratio=1:1` : collection?.logo;

  return (
    <div className={className}>
      <div className="flex justify-between items-center text-xs">
        <div>
          <Link href={`/collections/${collection.address}`} passHref>
            <a className="flex items-center cursor-pointer">
              <span className="inline-block rounded-full overflow-hidden w-[26px] h-[26px]  mr-1.5">
                <Image
                  className="h-8 w-8"
                  src={logoImage || DefaultLogo}
                  alt={name}
                  width={"100%"}
                  height={"100%"}
                />
              </span>
              <span className="dark:text-manatee text-frost font-medium hover:underline">{collection.name}</span>
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <button type="button" className="mr-3 flex" onClick={refreshMetaData}>
            <span className="text-cornflower mr-2">Refresh</span>
            <RefreshIcon className="w-[12px]" />
          </button>
          <button type="button" className="py-1 pl-1 flex">
            <span className="sr-only">Share</span>
            {/*<ShareIcon className="w-[13px]" />*/}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-top mt-1">
        <h1 className="text-2xl tracking-tight sm:text-3xl">{ name || 'Unnamed' }</h1>
        <div className="text-xs shrink-0">
          <span className="dark:text-manatee text-frost mr-2">Rarity rank</span>
          <div className="relative inline-block -right-[2px]">
            <ProgressHexagon width="35" height="35" percent={100 - ((rarity/maxRarity) * 100)} />
            <span className="absolute inset-0 flex items-center justify-center font-medium text-xxs">{ rarity?.toFixed(0) }</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs mt-1">
        <p>
          {/* Could also link to profile/account within the market place instead of blockexplorer */}
          <span className="dark:text-manatee text-frost">Owner</span>
          <Link href="/users/[address]" as={`/users/${owner}`} passHref>
            <a className="hover:text-indigo-600 dark:text-white font-medium text-black hover:underline ml-1">
              {isOwner ? 'You' : `${ellipseAddress(owner, 4)}`}
            </a>
          </Link>
        </p>
        <div className="relative -top-[3px]">
          <ItemPrice label="Last sale" value={lastSalePrice} currency={collection?.currency} />
        </div>
      </div>
    </div>
  );
}