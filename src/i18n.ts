import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import homePage from './locales/en/homePage.json';
import header from './locales/en/header.json';
import common from './locales/en/common.json';

import homePageHe from './locales/he/homePage.json';
import headerHe from './locales/he/header.json';
import commonHe from './locales/he/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        homePage,
        header,
        common
      },
      he: {
        homePage: homePageHe,
        header: headerHe,
        common: commonHe
      }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'he'],
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
