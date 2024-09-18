import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (ref: React.RefObject<HTMLElement>, offset: number = 0) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (ref.current) {
      // Using a setTimeout to ensure this happens after rendering
      setTimeout(() => {
        ref?.current?.scrollTo({
          top: offset,  // Use offset if you need to scroll more or less than the top
          behavior: 'smooth', // Optional: for smooth scroll
        });
      }, 0);  // Immediate scroll after render
    }
  }, [pathname, ref, offset]);
};
