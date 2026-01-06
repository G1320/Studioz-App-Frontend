import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import discoverPage from './locales/en/discoverPage.json';
import common from './locales/en/common.json';
import categories from './locales/en/categories.json';
import genres from './locales/en/genres.json';
import amenities from './locales/en/amenities.json';
import forms from './locales/en/forms.json';
import profile from './locales/en/profile.json';
import subscriptions from './locales/en/subscriptions.json';
import reservationDetails from './locales/en/reservationDetails.json';
import reservations from './locales/en/reservations.json';
import banners from './locales/en/banners.json';
import dashboard from './locales/en/dashboard.json';
import studio from './locales/en/studio.json';
import services from './locales/en/services.json';
import studios from './locales/en/studios.json';
import cities from './locales/en/cities.json';
import cookieConsent from './locales/en/cookieConsent.json';
import location from './locales/en/location.json';
import forOwners from './locales/en/forOwners.json';
import landing from './locales/en/landing.json';
import equipment from './locales/en/equipment.json';

import discoverPageHe from './locales/he/discoverPage.json';
import commonHe from './locales/he/common.json';
import categoriesHe from './locales/he/categories.json';
import genresHe from './locales/he/genres.json';
import amenitiesHe from './locales/he/amenities.json';
import formsHe from './locales/he/forms.json';
import profileHe from './locales/he/profile.json';
import subscriptionsHe from './locales/he/subscriptions.json';
import reservationDetailsHe from './locales/he/reservationDetails.json';
import reservationsHe from './locales/he/reservations.json';
import bannersHe from './locales/he/banners.json';
import dashboardHe from './locales/he/dashboard.json';
import studioHe from './locales/he/studio.json';
import servicesHe from './locales/he/services.json';
import studiosHe from './locales/he/studios.json';
import citiesHe from './locales/he/cities.json';
import cookieConsentHe from './locales/he/cookieConsent.json';
import locationHe from './locales/he/location.json';
import forOwnersHe from './locales/he/forOwners.json';
import landingHe from './locales/he/landing.json';
import equipmentHe from './locales/he/equipment.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        discoverPage,
        common,
        categories,
        genres,
        amenities,
        forms,
        profile,
        subscriptions,
        reservationDetails,
        reservations,
        banners,
        dashboard,
        studio,
        services,
        studios,
        cities,
        cookieConsent,
        location,
        forOwners,
        landing,
        equipment
      },
      he: {
        discoverPage: discoverPageHe,
        common: commonHe,
        categories: categoriesHe,
        genres: genresHe,
        amenities: amenitiesHe,
        forms: formsHe,
        profile: profileHe,
        subscriptions: subscriptionsHe,
        reservationDetails: reservationDetailsHe,
        reservations: reservationsHe,
        banners: bannersHe,
        dashboard: dashboardHe,
        studio: studioHe,
        services: servicesHe,
        studios: studiosHe,
        cities: citiesHe,
        cookieConsent: cookieConsentHe,
        location: locationHe,
        forOwners: forOwnersHe,
        landing: landingHe,
        equipment: equipmentHe
      }
    },
    fallbackLng: 'he',
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
