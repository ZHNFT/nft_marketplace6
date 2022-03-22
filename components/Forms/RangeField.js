import { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { fromUnixTime, format } from 'date-fns';
import clsx from 'clsx';

export default function RangeField({ step = 0.01, decimals, min = 0, max = 100, isDate, onChange }) {
  const [values, setValues] = useState([min, max]);

  useEffect(() => {
    setValues([min, max]);
  }, [min, max]);

  return (
    <div className="flex justify-center">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={values => { setValues(values); onChange(values); }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '95%'
            }}
          >
            <div
              ref={props.ref}
              className="h-[2px] w-full self-center"
              style={{
                background: getTrackBackground({
                  values,
                  colors: ['#494433', '#4d71be', '#494433'],
                  min,
                  max
                })
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ index, props, isDragged }) => (
          <div
            {...props}
            className="w-[12px] h-[12px] rounded-full flex justify-center items-center"
            style={{
              ...props.style,
              backgroundColor: isDragged ? '#5a93ff' : '#4d71be'
            }}
          >
            <div className={clsx(
              'absolute -bottom-[30px] py-1 px-1.5 dark:bg-white/[0.1] bg-black/[0.1] rounded text-xs',
              isDate ? 'text-xxs' : ''
            )}>
              { 
                isDate
                  ? `${format(fromUnixTime(values[index]), 'P')}`
                  : `${values[index] === 0 || values[index] === max ? values[index] : values[index].toFixed(decimals)}`
              }
            </div>
          </div>
        )}
      />
    </div>
  );
};