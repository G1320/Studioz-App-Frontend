import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (mainRef: any) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    console.log('useScrollToTop called with pathname:', pathname);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0); // Keep this as a fallback
  }, [pathname, mainRef]);
};
