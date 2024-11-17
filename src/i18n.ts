import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import homePage from './locales/en/homePage.json';
import header from './locales/en/header.json';
import common from './locales/en/common.json';

import homePageHe from './locales/he/homePage.json';
import headerHe from './locales/he/header.json';
import commonHe from './locales/he/common.json';

i18n.use(initReactI18next).init({
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
  lng: 'he',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
