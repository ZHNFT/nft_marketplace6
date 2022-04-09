import { useContext } from 'react';
import Web3Context from '../../../contexts/Web3Context';
import { ErrorMessage } from 'formik';
import { BeeIcon } from '../../icons';
import { usdFormatter, formatter } from '../../../Utils/helper';

export default function PriceInputField(props) {
  const { field, form, label = "Price", showTokenBalance = false, tokenPriceUsd, placeholder = "Enter amount" } = props;
  const { state: { tokenBalance } } = useContext(Web3Context);
  return (
    <div className="mt-4 mb-8">
    <div className='flex justify-between'>
      <label htmlFor="price" className='text-[#969EAB] text-xs'>{label}</label>
      {showTokenBalance ? (
      <div className="mt-1 text-xs text-right text-[#969EAB]">
        Balance: <span className='text-white'>{tokenBalance ? formatter.format(tokenBalance) : 0}</span>
      </div>) : null}
    </div>
    <div className="mt-1 relative">
      <div className="flex items-center rounded-lg bg-[#1F2225]">
        <div className="py-2 pl-2 pr-4">
          <BeeIcon className="h-[14px] pr-[5px]" />
          <span className="text-xs">HNY</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="15" viewBox="0 0 2 15" fill="none">
          <path d="M1 1L1 14" stroke="#77808B" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          inputMode="decimal"
          id="price"
          className="text-ink max-w-[235px] dark:text-white flex flex-1 focus:border-transparent focus:ring-0 bg-transparent border-transparent focus:outline-none placeholder:text-xs"
          placeholder={placeholder}
          {...field}
        />
        <span className="p-2 text-sm w-[80px] text-right">
          <span className="overflow-hidden text-xs truncate text-[#969EAB]">{tokenPriceUsd && field?.value ? usdFormatter.format(Number(field?.value) * tokenPriceUsd) : null}</span>
        </span>
      </div>
      {/* https://formik.org/docs/api/errormessage#props-1 */}
      <ErrorMessage name="price">{msg => <p className="mt-1 absolute text-sm text-red-600">{msg}</p>}</ErrorMessage>
    </div>
  </div>
  )
}