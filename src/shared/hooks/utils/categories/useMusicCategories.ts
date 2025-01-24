import { useTranslation } from 'react-i18next';

export const useMusicCategories = () => {
  const { t } = useTranslation('categories');

  return [t('main_categories.music_categories')];
};
