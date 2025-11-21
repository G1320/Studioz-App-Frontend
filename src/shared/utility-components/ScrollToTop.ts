// components/utils/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This function is called from AnimatedRoutes after animation completes
export const scrollToTop = () => {
  // Primary: Scroll #root (the actual scroll container based on CSS)
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.scrollTop = 0;
  }

  // Fallbacks for cross-platform compatibility
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo(0, 0);

  // Scroll down 1px to trigger reflow/repaint (test for UI bug fix)
  requestAnimationFrame(() => {
    if (rootElement) {
      rootElement.scrollTop = 0.1;
    }
    document.body.scrollTop = 0.1;
    document.documentElement.scrollTop = 0.1;
    window.scrollTo(0, 0.1);

    // Then scroll back to top
    requestAnimationFrame(() => {
      if (rootElement) {
        rootElement.scrollTop = 0;
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
    });
  });
};

// Component that handles scroll-to-top for non-animated routes
export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll immediately for non-animated routes
    // Animated routes handle scrolling via onAnimationComplete
    scrollToTop();
  }, [location.pathname]);

  return null;
};
