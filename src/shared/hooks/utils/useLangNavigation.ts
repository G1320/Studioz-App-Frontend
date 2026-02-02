import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, NavigateOptions } from 'react-router-dom';

export const useLanguageNavigate = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return useCallback((path: string, options?: NavigateOptions) => {
    const currentLang = i18n.language || 'en';
    navigate(`/${currentLang}${path}`, options);
  }, [i18n.language, navigate]);
};

/**
 * Hook for navigating to anchor sections, handling both same-page and cross-page navigation.
 * - Same page: scrolls smoothly to the anchor
 * - Different page: navigates with hash, ScrollToTop component handles scrolling
 */
export const useAnchorNavigate = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback((targetPath: string, anchor: string) => {
    const currentLang = i18n.language || 'en';
    // Handle empty targetPath as home page
    const normalizedPath = targetPath || '';
    const fullTargetPath = `/${currentLang}${normalizedPath}`;
    
    // Normalize current pathname for comparison (handle trailing slashes)
    const currentPathNormalized = location.pathname.replace(/\/$/, '');
    const targetPathNormalized = fullTargetPath.replace(/\/$/, '');
    
    // Check if we're already on the target page
    const isOnTargetPage = currentPathNormalized === targetPathNormalized ||
                           (normalizedPath === '' && (currentPathNormalized === `/${currentLang}` || currentPathNormalized === ''));

    if (isOnTargetPage) {
      // Already on target page, just scroll smoothly (no route change)
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Update URL hash without navigation
      window.history.pushState(null, '', `${location.pathname}#${anchor}`);
    } else {
      // Navigate to the page with hash - ScrollToTop will handle scrolling
      navigate(`${fullTargetPath}#${anchor}`);
    }
  }, [i18n.language, navigate, location.pathname]);
};
