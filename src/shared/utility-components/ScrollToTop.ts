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

let cancelPendingAnchorAlignment: (() => void) | null = null;

/**
 * Scroll to an anchor and correct its position after lazy sections finish
 * calculating their real height. This prevents the first navigation from
 * stopping short when content-visibility placeholders are replaced.
 */
export const scrollToAnchorElement = (element: HTMLElement) => {
  cancelPendingAnchorAlignment?.();

  const getTargetTop = () => {
    const header = document.querySelector<HTMLElement>('header.app-header');
    const headerHeight = header?.getBoundingClientRect().height || 0;
    return window.scrollY + element.getBoundingClientRect().top - headerHeight;
  };

  const align = (behavior: ScrollBehavior) => {
    const targetTop = getTargetTop();
    if (Math.abs(window.scrollY - targetTop) > 1) {
      window.scrollTo({ top: targetTop, left: 0, behavior });
    }
  };

  align('smooth');

  const timers = [window.setTimeout(() => align('auto'), 700), window.setTimeout(() => align('auto'), 1200)];
  const cancel = () => {
    timers.forEach(window.clearTimeout);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    if (cancelPendingAnchorAlignment === cancel) cancelPendingAnchorAlignment = null;
  };

  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchstart', cancel, { passive: true, once: true });
  window.setTimeout(cancel, 1300);
  cancelPendingAnchorAlignment = cancel;
};

// Scroll to a specific element by ID (for hash navigation)
const scrollToHash = (hash: string) => {
  const element = document.getElementById(hash);
  if (element) {
    scrollToAnchorElement(element);
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
