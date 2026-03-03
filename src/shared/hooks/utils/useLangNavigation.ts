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
    const normalizedPath = targetPath || '';
    const fullTargetPath = `/${currentLang}${normalizedPath}`;

    // If the anchor element already exists in the DOM, scroll directly.
    // Handles cases like home page rendering the same content as /for-owners.
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `${location.pathname}#${anchor}`);
      return;
    }

    // Element not on current page — navigate with hash; ScrollToTop handles the rest
    navigate(`${fullTargetPath}#${anchor}`);
  }, [i18n.language, navigate, location.pathname]);
};
