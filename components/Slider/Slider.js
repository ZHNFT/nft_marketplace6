import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { ArrowIcon } from '../icons';

export default function Slider({ className, arrowSize, children }) {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slider = useRef(null);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      slider.current !== null &&
      slider.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && slider.current !== null) {
      return (
        slider.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    maxScrollWidth.current = slider.current
      ? slider.current.scrollWidth - slider.current.offsetWidth
      : 0;
  }, []);

  useEffect(() => {
    if (slider !== null && slider.current !== null) {
      slider.current.scrollLeft = slider.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  return (
    <div className={clsx('mx-auto', className)}>
      <div className="relative">
        <div className={clsx(
          'flex justify-between absolute -left-[10px] -right-[10px] w-auto h-full',
          arrowSize === 'sml' ? '-left-[32px] -right-[46px] lg:-left-[28px] lg:-right-[45px]' : 'lg:-left-[60px] lg:-right-[60px]'
        )}>
          <button
            onClick={event => { event.preventDefault(); movePrev(); }}
            className={clsx(
              'text-white h-full text-center disabled:opacity-0 z-10 p-0 m-0 transition-all ease-in-out duration-300',
              arrowSize === 'sml' ? 'w-6' : 'w-10'
            )}
            disabled={isDisabled('prev')}
          >
            <span className={clsx(
              'flex justify-center items-center bg-black/[0.5] dark:bg-white/[0.05] hover:bg-cornflower dark:hover:bg-cornflower rounded-full',
              arrowSize === 'sml' ? 'w-[24px] h-[24px]' : 'w-[38px] h-[38px]'
            )}>
              <ArrowIcon className={clsx(arrowSize === 'sml' ? 'w-[6px]' : 'w-[11px]')} type="left" />
            </span>
            <span className="sr-only">Previous</span>
          </button>
          <button
            onClick={event => { event.preventDefault(); moveNext(); }}
            className={clsx(
              'text-white w-10 h-full text-center disabled:opacity-0 z-10 p-0 m-0 transition-all ease-in-out duration-300',
              arrowSize === 'sml' ? 'w-6' : 'w-10'
            )}
            disabled={isDisabled('next')}
          >
            <span className={clsx(
              'flex justify-center items-center bg-black/[0.5] dark:bg-white/[0.05] hover:bg-cornflower dark:hover:bg-cornflower rounded-full',
              arrowSize === 'sml' ? 'w-[24px] h-[24px]' : 'w-[38px] h-[38px]'
            )}>
              <ArrowIcon className={clsx(arrowSize === 'sml' ? 'w-[6px]' : 'w-[11px]')} />
            </span>
            <span className="sr-only">Next</span>
          </button>
        </div>
        <div
          ref={slider}
          className="relative flex gap-3.5 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
        >
          { children }
        </div>
      </div>
    </div>
  );
};
