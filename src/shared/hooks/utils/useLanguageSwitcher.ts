import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Headless hook for language switching functionality
 * Handles:
 * - Setting HTML lang and dir attributes
 * - Language change logic with URL updates
 * - Returns current language and change function
 */
export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Set HTML lang and dir attributes whenever language changes
  useEffect(() => {
    const currentLang = i18n.language || 'en';
    const isRTL = currentLang === 'he';
    
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Set initial dir attribute on mount (in case i18n hasn't initialized yet)
  useEffect(() => {
    const currentLang = i18n.language || 'en';
    const isRTL = currentLang === 'he';
    
    // Only set if not already set
    if (!document.documentElement.dir) {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, []);

  const changeLanguage = (lang: string) => {
    const currentPath = window.location.pathname;
    let newPath;

    if (currentPath === '/' || currentPath === '/en' || currentPath === '/he') {
      newPath = `/${lang}`;
    } else {
      if (currentPath.match(/^\/[a-z]{2}\//)) {
        newPath = currentPath.replace(/^\/[a-z]{2}\//, `/${lang}/`);
      } else {
        newPath = `/${lang}${currentPath}`;
      }
    }

    i18n.changeLanguage(lang);
    navigate(newPath, { replace: true });
  };

  return {
    currentLanguage: i18n.language || 'en',
    changeLanguage,
    isRTL: i18n.dir() === 'rtl'
  };
};

