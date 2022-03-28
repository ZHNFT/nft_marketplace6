import { ethers } from "ethers";
import { BeeIcon } from '../icons';

export default function ItemPrice({ label, value }) {
  console.log(`value`, value)
  return (
    <>
      { label && <span className="text-silver dark:text-manatee">{ label }</span> }
      <BeeIcon className="w-[22px] -top-[2px] relative" />
      <span className="text-xs">{ value ? ethers.utils.formatEther(ethers.BigNumber.from(value.toString())) : value }</span>
    </>
  );
}