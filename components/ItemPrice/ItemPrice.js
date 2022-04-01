import { BeeIcon } from '../icons';
import { formatEther } from '../../Utils/helper';

export default function ItemPrice({ label, value }) {
  return (
    <>
      { label && <span className="text-silver dark:text-manatee">{ label }</span> }
      <BeeIcon className="h-[18px] -top-[2px] relative" />
      <span className="text-xs">{ value ? formatEther(value) : value }</span>
    </>
  );
}