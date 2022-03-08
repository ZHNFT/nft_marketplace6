import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react'
import clsx from 'clsx';
import Image from 'next/image';
import { PulseIcon } from '../icons';

export default function ItemMain({ name, imageUrl }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div 
      className="relative rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        className={clsx(
          'block w-full',
          isHovering ? 'blur-sm' : ''
        )}
        src={imageUrl}
        alt={name}
        width="210"
        height="210"
      />
      {
        <Transition
          show={isHovering}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full bg-black/[0.3]">
            <div className="flex justify-center items-center absolute h-[23px] w-[23px] top-[12px] right-[13px] rounded-full bg-white/[0.1]">
              <PulseIcon className="w-[15px]" />
            </div>
            <div className="w-full mx-[14px] flex justify-between">
              <button type="button" className="flex-1 bg-malibu rounded-lg p-2 border-[0.5px] border-malibu mr-[6px]">Buy now</button>
              <button type="button" className="flex-1 bg-white/[0.1] border-[0.5px] rounded-lg p-2 ml-[6px]">Make offer</button>
            </div>
          </div>
        </Transition>
      }
    </div>
  );
}