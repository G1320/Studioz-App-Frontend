import { useTranslation } from 'react-i18next';
import { genres } from '@core/config/genres';
import genresJson from '@core/i18n/locales/en/genres.json';

export const useMusicGenres = () => {
  const { t } = useTranslation('genres');

  // Return array of translated genre names in the same order as the config
  // This matches the pattern of useMusicSubCategories
  // We iterate over the config array to maintain order, then find the key for each genre
  return genres.map((englishValue) => {
    // Find the key for this English value in the JSON
    const key = Object.keys(genresJson).find((k) => genresJson[k as keyof typeof genresJson] === englishValue);
    // Return translated value, or fallback to English if key not found
    return key ? t(key) : englishValue;
  });
};
