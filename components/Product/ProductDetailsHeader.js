import Link from 'next/link';
import { ellipseAddress } from '../../Utils';
import { HexagonBeeIcon, RefreshIcon, ShareIcon } from '../icons';
import ItemPrice from '../ItemPrice/ItemPrice';
import ProgressHexagon from '../ProgressHexagon/ProgressHexagon';

export default function ProductDetailsHeader({ className, name, owner, isOwner, address, collection, rarityRank, lastSalePrice }) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center text-xs">
        <div>
          <HexagonBeeIcon className="w-[26px] mr-1.5" />
          <span className="text-manatee font-medium">Hive Investments</span>
        </div>
        <div className="flex items-center">
          <button type="button" className="mr-3 flex">
            <span className="text-cornflower mr-2">Refresh</span>
            <RefreshIcon className="w-[12px]" />
          </button>
          <button type="button" className="py-1 pl-1 flex">
            <span className="sr-only">Share</span>
            <ShareIcon className="w-[13px]" />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-top mt-1">
        <h1 className="text-2xl tracking-tight sm:text-3xl">{ name || 'Unnamed' }</h1>
        <div className="text-xs shrink-0">
          <span className="text-manatee mr-2">Rarity score</span>
          <div className="relative inline-block -right-[2px]">
            <ProgressHexagon width="35" height="35" percent={25} />
            <span className="absolute inset-0 flex items-center justify-center font-medium">{ rarityRank }</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs mt-1">
        <p>
          {/* Could also link to profile/account within the market place instead of blockexplorer */}
          <span className="text-manatee">Owner</span>
          <Link href="/users/[address]" as={`/users/${owner}`} passHref>
            <a className="hover:text-indigo-600 dark:text-white font-medium text-black hover:underline ml-1">
              {isOwner ? 'You' : `${ellipseAddress(owner, 4)}`}
            </a>
          </Link>
        </p>
        <div className="relative -top-[4px]">
          <ItemPrice label="Last sale" value={lastSalePrice} />
        </div>
      </div>
    </div>
  );
}