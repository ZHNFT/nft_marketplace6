import { BeeIcon } from '../icons';
import { formatEther } from '../../Utils/helper';

export default function ItemPrice({ label, value, inline = false }) {
  if (inline) {
    return (
      <div className='flex items-center'>
        { label && <span className="text-silver dark:text-manatee">{ label }</span> }
        <BeeIcon className="h-[12px] -top-[1px] relative px-[5px]" />
        <span className="text-xs">{ value ? formatEther(value) : "0" }</span>
      </div>
    )
  }
  return (
    <>
      { label && <span className="text-silver dark:text-manatee">{ label }</span> }
      <BeeIcon className="h-[12px] -top-[1px] relative px-[5px]" />
      <span className="text-xs">{ value ? formatEther(value) : "0" }</span>
    </>
  );
}