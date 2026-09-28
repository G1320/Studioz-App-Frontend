import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isFeatureEnabled } from '@core/config/featureFlags';

/**
 * Keep i18n.language and <html lang/dir> aligned with the /:lang URL segment.
 * Without this, LanguageDetector only runs on first load — navigating to
 * /en/... while i18n is still `he` (or vice versa) leaves copy and document
 * language wrong.
 *
 * When hebrewLocale is off, /he/* is rewritten to /en/*.
 */
export function useSyncLanguageFromPath() {
  const { i18n } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const match = pathname.match(/^\/(en|he)(?=\/|$)/);
    const pathLang = match?.[1];
    if (!pathLang) return;

    if (pathLang === 'he' && !isFeatureEnabled('hebrewLocale')) {
      // Screenshot capture still needs /he routes for localized product shots.
      const isScreenshotCapture =
        typeof window !== 'undefined' &&
        window.localStorage?.getItem('studioz-screenshot-capture') === '1';
      if (!isScreenshotCapture) {
        const enPath = pathname.replace(/^\/he(?=\/|$)/, '/en');
        navigate(`${enPath}${search}${hash}`, { replace: true });
        return;
      }
    }

    const current = (i18n.language || '').split('-')[0];
    if (current !== pathLang) {
      void i18n.changeLanguage(pathLang);
    }

    // Always sync document language from the URL (not only when i18n changes)
    document.documentElement.lang = pathLang;
    document.documentElement.dir = pathLang === 'he' ? 'rtl' : 'ltr';
  }, [pathname, search, hash, i18n, navigate]);
}
