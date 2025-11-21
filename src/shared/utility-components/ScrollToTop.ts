// components/utils/ScrollToTop.tsx
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
};

// Keep the component for backwards compatibility, but it won't be used
export const ScrollToTop = () => {
  return null;
};
