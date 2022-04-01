import { useState, useEffect } from 'react';

// limit the number of times a value changes according to the specified delay time and returns the most recent changed value
export const useDebounce = ({ value, delay }) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // update debounced value only after the delay time
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // clear timeout when value or delay changes
        return () => { clearTimeout(timer); };
    }, [value, delay]);

    return debouncedValue;
};