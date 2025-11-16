import { useTranslation } from 'react-i18next';
import categoriesJson from '@core/i18n/locales/en/categories.json';
import { createTranslationHelpers, TranslationOption } from '@shared/utils/translationUtils';

export interface CategoryOption extends TranslationOption {}

export const useCategories = () => {
  const { t } = useTranslation('categories');

  const {
    getOptions: getMusicSubCategories,
    getEnglishValues: getMusicSubCategoriesEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay
  } = createTranslationHelpers({
    jsonData: categoriesJson.subCategories.musicAndPodcast,
    translationKeyPrefix: 'subCategories.musicAndPodcast.', // Categories use nested structure
    t
  });

  return {
    getMusicSubCategories: (): CategoryOption[] => getMusicSubCategories(),
    getMusicSubCategoriesEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay
  };
};
