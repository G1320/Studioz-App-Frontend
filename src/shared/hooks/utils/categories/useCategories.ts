import { useTranslation } from 'react-i18next';
import categoriesJson from '../../../../locales/en/categories.json';

interface CategoryOption {
  key: string; // The key used in URLs and database
  value: string; // The translated display value
  englishValue: string; // The English value for database matching
}

export const useCategories = () => {
  const { t } = useTranslation('categories');

  const getMusicSubCategories = (): CategoryOption[] => {
    return Object.entries(categoriesJson.subCategories.musicAndPodcast).map(([key, englishValue]) => ({
      key,
      value: t(`subCategories.musicAndPodcast.${key}`), // Hebrew display value
      englishValue // English value
    }));
  };

  // Get all English values
  const getMusicSubCategoriesEnglish = (): string[] => {
    return Object.values(categoriesJson.subCategories.musicAndPodcast);
  };

  // Get Hebrew display value for an English value
  const getDisplayByEnglish = (englishValue: string): string => {
    const category = getMusicSubCategories().find((cat) => cat.englishValue === englishValue);
    return category?.value || englishValue;
  };

  // Get English value for a Hebrew display value
  const getEnglishByDisplay = (displayValue: string): string => {
    const category = getMusicSubCategories().find((cat) => cat.value === displayValue);
    return category?.englishValue || displayValue;
  };

  return {
    getMusicSubCategories,
    getMusicSubCategoriesEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay
  };
};
