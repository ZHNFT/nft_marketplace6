import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDownIcon } from '../icons';

export default function Dropdown({ className, buttonClassName, label, isSelectField, isDisabled = false, size, list, selected, error, onSelect }) {
  return (
    <div className={clsx('w-full', className ? className : '' )}>
      <Listbox value={selected} disabled={isDisabled} label={label} onChange={onSelect}>
        <div className="relative">
          <Listbox.Button className={clsx(
            'cursor-pointer relative w-full focus:outline-none focus-visible:border-malibu',
            isSelectField ? 'select-field rounded-md text-white border-[0.5px] border-transparent focus:border-malibu text-left !text-sm' : 'py-2.5 pl-3 pr-10 text-center rounded-[20px] focus:outline-none font-medium border-[0.5px] border-rhino',
            isDisabled ? 'opacity-50' : '',
            size === 'sml' ? 'text-xs' : 'text-base',
            buttonClassName
          )}>
            <span className={clsx('block truncate', !selected.value ? 'text-manatee' : '')}>{selected.label}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon
                className={clsx('text-ink pr-1', isSelectField ? 'w-[14px] text-malibu' : 'w-[16px] dark:text-white')}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          { error && <p className="-mt-0.5 absolute text-xxs text-red-600">{ error}</p> }
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 w-full py-1 mt-2.5 overflow-auto text-base rounded-[12px] max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-white dark:bg-pitch">
              {list.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-2 px-4 ${
                      active ? 'bg-whiteLilac dark:bg-malibu' : ''
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-light'
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}