import { useTranslation } from 'react-i18next';
import genresJson from '@core/i18n/locales/en/genres.json';
// import { genres } from '@core/config/genres';

interface GenreOption {
  key: string; // The key used in URLs and database (e.g., "rock", "hip_hop")
  value: string; // The translated display value
  englishValue: string; // The English value for database matching (e.g., "Rock", "Hip-Hop")
}

export const useGenres = () => {
  const { t } = useTranslation('genres');

  const getGenres = (): GenreOption[] => {
    return Object.entries(genresJson).map(([key, englishValue]) => ({
      key,
      value: t(key), // Translated display value (Hebrew or English)
      englishValue // English value (e.g., "Rock", "Hip-Hop")
    }));
  };

  // Get all English values (for database matching)
  const getGenresEnglish = (): string[] => {
    return Object.values(genresJson);
  };

  // Get translated display value for an English value
  // Example: getDisplayByEnglish("Rock") returns "רוק" (Hebrew) or "Rock" (English)
  const getDisplayByEnglish = (englishValue: string): string => {
    const genre = getGenres().find((g) => g.englishValue === englishValue);
    return genre?.value || englishValue;
  };

  // Get English value for a translated display value
  // Example: getEnglishByDisplay("רוק") returns "Rock"
  const getEnglishByDisplay = (displayValue: string): string => {
    const genre = getGenres().find((g) => g.value === displayValue);
    return genre?.englishValue || displayValue;
  };

  // Get English value from a genre key
  // Example: getEnglishByKey("rock") returns "Rock"
  const getEnglishByKey = (key: string): string => {
    return genresJson[key as keyof typeof genresJson] || key;
  };

  // Get genre key from English value
  // Example: getKeyByEnglish("Rock") returns "rock"
  const getKeyByEnglish = (englishValue: string): string => {
    const genre = getGenres().find((g) => g.englishValue === englishValue);
    return genre?.key || englishValue.toLowerCase().replace(/\s+/g, '_');
  };

  return {
    getGenres,
    getGenresEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getEnglishByKey,
    getKeyByEnglish
  };
};
