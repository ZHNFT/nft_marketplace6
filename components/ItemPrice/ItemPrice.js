import { BeeIcon } from '../icons';
import { formatEther } from '../../Utils/helper';

export default function ItemPrice({ label, value }) {
  return (
    <>
      { label && <span className="text-silver dark:text-manatee">{ label }</span> }
      <BeeIcon className="h-[14px] -top-[2px] relative px-[5px]" />
      <span className="text-xs">{ value ? formatEther(value) : "0" }</span>
    </>
  );
}