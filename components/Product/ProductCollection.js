import { HexagonBeeIcon, InstagramIcon, TwitterIcon, ChainIcon, BeeIcon } from '../icons';

export default function ProductCollection({ collectionId, itemCount, ownerCount, volume, floorPrice, instagram, twitter, website }) {
  return (
    <div>
      <div className="flex justify-between items-center text-xs">
        <div>
          <HexagonBeeIcon className="w-[26px] mr-1.5" />
          <span className="font-medium">Hive Investments</span>
        </div>
        <div className="flex items-center text-manatee shrink-0 ml-1 mr-2">
          {
            instagram && (
              <a href={instagram} target="_blank" className="hover:text-cornflower" rel="noreferrer">
                <span className="sr-only">Instagram</span>
                <InstagramIcon className="w-[16px]" />
              </a>  
            )
          }

          {
            twitter && (
              <a href={instagram} target="_blank" rel="noreferrer" className="ml-4 hover:text-cornflower">
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="w-[18px]" />
              </a>  
            )
          }

          {
            website && (
              <a href={instagram} target="_blank" rel="noreferrer" className="ml-4 hover:text-cornflower">
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
            <span className="text-manatee text-xs font-medium">Items</span>
            <span className="block text-base font-medium">{ itemCount }</span> 
          </div>
          <div>
            <span className="text-manatee text-xs font-medium">Owners</span>
            <span className="block text-base font-medium">{ ownerCount }</span> 
          </div>
          <div className="relative">
            <span className="text-manatee text-xs font-medium">Volume</span>
            <span className="block flex text-base font-medium">
              <BeeIcon className="h-[18px] relative -top-[2px]" />
              { volume }
            </span> 
            <span className="text-manatee text-xxs absolute left-0 right-0 w-[74px]">Last 30 days</span>
          </div>
          <div>
            <span className="text-manatee text-xs font-medium">Floor</span>
            <span className="block flex text-base font-medium">
              <BeeIcon className="h-[18px] relative -top-[2px]" />
              { floorPrice }
            </span> 
          </div>
        </div>
        <div className="text-xxs text-manatee mt-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
    </div>
  );
};