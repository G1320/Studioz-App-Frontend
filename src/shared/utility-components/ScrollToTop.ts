// components/utils/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Primary: Scroll #root (the actual scroll container based on CSS)
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTop = 0;
    }

    // Fallbacks for cross-platform compatibility
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};
