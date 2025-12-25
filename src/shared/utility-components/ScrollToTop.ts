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

// Function to manage focus on route change
export const focusMainContent = () => {
  // Try to focus the main content element
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    // Make it focusable temporarily if it's not already
    const originalTabIndex = mainContent.getAttribute('tabindex');
    if (!originalTabIndex) {
      mainContent.setAttribute('tabindex', '-1');
    }
    
    mainContent.focus();
    
    // Remove tabindex after focus to restore normal behavior
    // Use setTimeout to ensure focus happens first
    setTimeout(() => {
      if (!originalTabIndex) {
        mainContent.removeAttribute('tabindex');
      }
    }, 0);
  } else {
    // Fallback: try to focus the first heading on the page
    const firstHeading = document.querySelector('main h1, main h2, main h3, main h4, main h5, main h6');
    if (firstHeading instanceof HTMLElement) {
      const originalTabIndex = firstHeading.getAttribute('tabindex');
      if (!originalTabIndex) {
        firstHeading.setAttribute('tabindex', '-1');
      }
      firstHeading.focus();
      setTimeout(() => {
        if (!originalTabIndex) {
          firstHeading.removeAttribute('tabindex');
        }
      }, 0);
    }
  }
};

// Component that handles scroll-to-top and focus management for non-animated routes
export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll immediately for non-animated routes
    // Animated routes handle scrolling via onAnimationComplete
    scrollToTop();
    
    // Move focus to main content for accessibility
    // Use a small delay to ensure DOM has updated
    const focusTimeout = setTimeout(() => {
      focusMainContent();
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, [location.pathname]);

  return null;
};
