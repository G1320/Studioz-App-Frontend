// components/utils/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Wait for animation to complete (250ms) before scrolling
    // This ensures content is fully rendered and visible
    const timer = setTimeout(() => {
      // Primary: Scroll #root (the actual scroll container based on CSS)
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.scrollTop = 0;
      }

      // Fallbacks for cross-platform compatibility
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 300); // Slightly longer than animation duration (250ms)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};
