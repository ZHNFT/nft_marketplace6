import { BeeIcon } from '../icons';

export default function ItemPrice({ label, value }) {
  return (
    <>
      <span className="text-silver dark:text-manatee">{ label }</span>
      <BeeIcon className="w-[22px] -top-[2px] relative" />
      <span className="text-xs">{ value }</span>
    </>
  );
}