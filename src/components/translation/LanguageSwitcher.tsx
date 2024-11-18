import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <section className="lang-switcher">
      <span onClick={() => changeLanguage('en')}>🇺🇸</span>
      <span onClick={() => changeLanguage('he')}>🇮🇱</span>
    </section>
  );
};
