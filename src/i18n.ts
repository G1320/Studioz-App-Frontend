import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import homePage from './locales/en/homePage.json';
import common from './locales/en/common.json';
import categories from './locales/en/categories.json';

import homePageHe from './locales/he/homePage.json';
import commonHe from './locales/he/common.json';
import categoriesHe from './locales/he/categories.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        homePage,
        common,
        categories
      },
      he: {
        homePage: homePageHe,
        common: commonHe,
        categories: categoriesHe
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
