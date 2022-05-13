import CurrencyIcon from '../CurrencyIcon/CurrencyIcon';
import { formatEther } from '../../Utils/helper';

export default function ItemPrice({ currency, label, value }) {
  return (
    <span className="flex items-center">
      { label && <span className="text-frost dark:text-manatee mr-1">{ label }</span> }
      <span className="flex"><CurrencyIcon currency={currency} hnyClassName="h-[12px] -top-[1px] -mr-1 relative px-[5px]" ethWidth={10} ethHeight={14} /></span>
      <span className="text-xs ml-1">{ value ? formatEther(value) : "0" }</span>
    </span>
  );
}