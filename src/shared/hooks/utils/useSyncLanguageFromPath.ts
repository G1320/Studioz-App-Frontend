import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Keep i18n.language and <html lang/dir> aligned with the /:lang URL segment.
 * Without this, LanguageDetector only runs on first load — navigating to
 * /en/... while i18n is still `he` (or vice versa) leaves copy and document
 * language wrong.
 */
export function useSyncLanguageFromPath() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const match = pathname.match(/^\/(en|he)(?=\/|$)/);
    const pathLang = match?.[1];
    if (!pathLang) return;

    const current = (i18n.language || '').split('-')[0];
    if (current !== pathLang) {
      void i18n.changeLanguage(pathLang);
    }

    // Always sync document language from the URL (not only when i18n changes)
    document.documentElement.lang = pathLang;
    document.documentElement.dir = pathLang === 'he' ? 'rtl' : 'ltr';
  }, [pathname, i18n]);
}
