import { useTranslation } from 'react-i18next';

export const usePhotoCategories = () => {
  const { t } = useTranslation('categories');

  return [t('main_categories.photo_categories')];
};
