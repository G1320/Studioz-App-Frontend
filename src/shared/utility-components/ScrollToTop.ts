// components/utils/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollOptions = {
      top: 0,
      left: 0
    };

    // Target the main content div
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo(scrollOptions);
    }
    // Also scroll the window itself
    window.scrollTo(scrollOptions);
  }, [location.pathname]);

  return null;
};
