import { TFunction } from 'i18next';

/**
 * Generic option interface for translated items (categories, genres, etc.)
 */
export interface TranslationOption {
  key: string; // The key used in URLs and database
  value: string; // The translated display value
  englishValue: string; // The English value for database matching
}

/**
 * Configuration for creating translation helpers
 */
export interface TranslationConfig {
  jsonData: Record<string, string>; // The JSON object with English values (e.g., genresJson or categoriesJson.subCategories.musicAndPodcast)
  translationKeyPrefix?: string; // Optional prefix for translation keys (e.g., "subCategories.musicAndPodcast." or "")
  t: TFunction; // The translation function from useTranslation
}

/**
 * Creates translation helpers for a given JSON data structure
 * This consolidates the shared logic between useCategories and useGenres
 */
export const createTranslationHelpers = (config: TranslationConfig) => {
  const { jsonData, translationKeyPrefix = '', t } = config;

  /**
   * Get all options with key, translated value, and English value
   */
  const getOptions = (): TranslationOption[] => {
    return Object.entries(jsonData).map(([key, englishValue]) => ({
      key,
      value: t(`${translationKeyPrefix}${key}`), // Translated display value
      englishValue // English value
    }));
  };

  /**
   * Get all English values (for database matching)
   */
  const getEnglishValues = (): string[] => {
    return Object.values(jsonData);
  };

  /**
   * Get translated display value for an English value
   * Example: getDisplayByEnglish("Rock") returns "רוק" (Hebrew) or "Rock" (English)
   */
  const getDisplayByEnglish = (englishValue: string): string => {
    const option = getOptions().find((opt) => opt.englishValue === englishValue);
    return option?.value || englishValue;
  };

  /**
   * Get English value for a translated display value
   * Example: getEnglishByDisplay("רוק") returns "Rock"
   */
  const getEnglishByDisplay = (displayValue: string): string => {
    const option = getOptions().find((opt) => opt.value === displayValue);
    return option?.englishValue || displayValue;
  };

  /**
   * Get English value from a key
   * Example: getEnglishByKey("rock") returns "Rock"
   */
  const getEnglishByKey = (key: string): string => {
    return jsonData[key] || key;
  };

  /**
   * Get key from English value
   * Example: getKeyByEnglish("Rock") returns "rock"
   */
  const getKeyByEnglish = (englishValue: string): string => {
    const option = getOptions().find((opt) => opt.englishValue === englishValue);
    return option?.key || englishValue.toLowerCase().replace(/\s+/g, '_');
  };

  return {
    getOptions,
    getEnglishValues,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getEnglishByKey,
    getKeyByEnglish
  };
};
