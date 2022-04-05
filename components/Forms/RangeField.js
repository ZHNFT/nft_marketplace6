import { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { fromUnixTime, format } from 'date-fns';
import clsx from 'clsx';
import { useDidMount } from '../../hooks/useDidMount';
import { useDebounce } from '../../hooks/useDebounce';

export default function RangeField(props) {
  const { initialValues = [0], suffix, step = 0.01, decimals, min = 0, max = 100, isDate, isReset, onChange } = props;
  const [values, setValues] = useState(initialValues);
  const [isDefaultValues, setIsDefaultValues] = useState();
  const didMount = useDidMount();
  const debouncedValue = useDebounce({ value: values, delay: 500 });

  useEffect(() => {
    if(isReset) {
      setIsDefaultValues(true);
      setValues(initialValues);
    }
  }, [isReset, initialValues]);

  useEffect(() => {
    if (didMount && debouncedValue && !isDefaultValues) {
      onChange(debouncedValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="flex justify-center">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={values => { setIsDefaultValues(false); setValues(values); }}
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
                  colors: values?.length > 1 ? ['#494433', '#4d71be', '#494433'] : ['#3CA075', '#494433'],
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
            className={clsx(
              'w-[12px] h-[12px] rounded-full flex justify-center items-center',
              isDragged ? 'brightness-120' : ''
            )}
            style={{
              ...props.style,
              backgroundColor: values?.length > 1 ? '#4d71be' : '#3CA075'
            }}
          >
            <div className={clsx(
              'absolute -bottom-[30px] py-1 px-1.5 dark:bg-white/[0.1] bg-black/[0.1] rounded text-xs',
              isDate ? 'text-xxs' : ''
            )}>
              { 
                values ? isDate
                  ? `${format(fromUnixTime(values[index]), 'P')}`
                  : `${values[index] === 0 || values[index] === max ? values[index] : values[index].toFixed(decimals)}${suffix ? suffix : ''}`
                  : ""
              }
            </div>
          </div>
        )}
      />
    </div>
  );
};