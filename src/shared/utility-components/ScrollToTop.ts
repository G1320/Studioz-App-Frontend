// components/utils/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollToTop = () => {
  // Primary: Scroll #root (the actual scroll container based on CSS)
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.scrollTop = 0;
  }

  // Fallbacks for cross-platform compatibility
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo(0, 0);
};

export const ScrollToTop = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    // Delay scroll to ensure content is fully rendered (fixes mobile UI disappearing bug)
    // Use requestAnimationFrame to wait for next paint, then add small delay for AnimatePresence
    requestAnimationFrame(() => {
      // Small delay to ensure AnimatePresence animation completes and DOM is stable
      setTimeout(() => {
        scrollToTop();
      }, 100);
    });
  }, [location.pathname]);

  // Scroll to top when clicking navigation links (even if same page)
  useEffect(() => {
    const handleNavigationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is on a navigation link or logo
      const isNavLink = target.closest('.navbar-link') || target.closest('.logo');

      if (isNavLink) {
        // Delay to ensure React Router processes navigation first, then scroll
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToTop();
          }, 150); // Slightly longer delay for navigation clicks to ensure DOM is ready
        });
      }
    };

    document.addEventListener('click', handleNavigationClick, true);
    return () => {
      document.removeEventListener('click', handleNavigationClick, true);
    };
  }, []);

  return null;
};
