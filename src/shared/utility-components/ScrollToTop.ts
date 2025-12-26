// components/utils/ScrollToTop.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to top function - can be called from anywhere
export const scrollToTop = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.scrollTop = 0;
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo(0, 0);
};

// Component that scrolls to top on route changes
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Prevent scroll restoration on initial load
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Remove hash from URL if present
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    scrollToTop();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
};
