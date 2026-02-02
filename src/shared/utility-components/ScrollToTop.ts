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

// Scroll to a specific element by ID (for hash navigation)
const scrollToHash = (hash: string) => {
  const element = document.getElementById(hash);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    return true;
  }
  return false;
};

// Component that scrolls to top on route changes (respects hash navigation)
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // Prevent browser's default scroll restoration
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Handle scroll on route change
  useEffect(() => {
    // If there's a hash, scroll to that element instead of top
    if (hash) {
      const elementId = hash.slice(1); // Remove the # prefix
      // Wait for DOM to be ready, then scroll to element
      const attemptScroll = (retries = 0) => {
        if (scrollToHash(elementId)) {
          return; // Successfully scrolled
        }
        // Retry a few times in case element isn't rendered yet
        if (retries < 10) {
          requestAnimationFrame(() => attemptScroll(retries + 1));
        }
      };
      
      // Start attempting to scroll after a brief delay
      requestAnimationFrame(() => attemptScroll());
    } else {
      // No hash, scroll to top
      scrollToTop();
    }
  }, [pathname, hash]);

  return null;
};
