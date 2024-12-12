import { useTranslation } from 'react-i18next';

export const useDays = () => {
  const { t } = useTranslation('common');

  return Object.values(t('days', { returnObjects: true }));
};
