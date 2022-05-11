import { useRef, useEffect } from 'react';

// returns whether component has mounted or not
export const useDidMount = () => {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
  }, []);
  
  return ref.current;
};