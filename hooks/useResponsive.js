import { useState, useEffect } from 'react';

export default function useResponsive({ query }) {
  const [isMatch, setIsMatch] = useState(false);
  const checkMediaQuery = () => {
    setIsMatch(window.matchMedia(query).matches);
  };

  useEffect(() => {
    checkMediaQuery();
    window.addEventListener('resize', checkMediaQuery);
    return () => {
      window.removeEventListener('resize', checkMediaQuery);
    };
  }, []);

  return isMatch;
};
