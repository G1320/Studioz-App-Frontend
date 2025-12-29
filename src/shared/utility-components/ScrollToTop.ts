// components/utils/ScrollToTop.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Internal scroll function
const doScroll = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.scrollTop = 0;
  }
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
};

// Scroll to top function - can be called from anywhere
// Uses requestAnimationFrame and a small retry to handle layout shifts
export const scrollToTop = () => {
  // Immediate scroll
  doScroll();

  // Scroll again after next paint to handle any layout shifts
  requestAnimationFrame(() => {
    doScroll();
    // One more scroll after a short delay to catch lazy-loaded content
    requestAnimationFrame(() => {
      doScroll();
    });
  });
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
