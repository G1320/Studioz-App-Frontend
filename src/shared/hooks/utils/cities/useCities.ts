import { useTranslation } from 'react-i18next';
import citiesJson from '@core/i18n/locales/en/cities.json';
import { createTranslationHelpers, TranslationOption } from '@shared/utils/translationUtils';

export interface CityOption extends TranslationOption {}

// Helper function to convert city name to translation key
const cityNameToKey = (cityName: string): string => {
  return cityName
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
};

export const useCities = () => {
  const { t } = useTranslation('cities');

  const {
    getOptions,
    getEnglishValues,
    getDisplayByEnglish,
    getEnglishByDisplay
  } = createTranslationHelpers({
    jsonData: citiesJson,
    translationKeyPrefix: '',
    t
  });

  // Get display name for a city name (English value)
  const getDisplayByCityName = (cityName: string): string => {
    const key = cityNameToKey(cityName);
    return t(key) || cityName;
  };

  return {
    getOptions,
    getEnglishValues,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getDisplayByCityName
  };
};

