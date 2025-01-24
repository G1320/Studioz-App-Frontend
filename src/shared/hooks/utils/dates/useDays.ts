import { useTranslation } from 'react-i18next';
import commonLocale from '../../../../locales/en/common.json';

interface DayOption {
  key: string;
  value: string;
  englishValue: string;
}

export const useDays = () => {
  const { t } = useTranslation('common');

  const getDays = (): DayOption[] => {
    return Object.entries(commonLocale.days).map(([key, englishValue]) => ({
      key,
      value: t(`days.${key}`),
      englishValue
    }));
  };

  const getDaysEnglish = (): string[] => {
    return Object.values(commonLocale.days);
  };

  const getDisplayByEnglish = (englishValue: string): string => {
    const day = getDays().find((d) => d.englishValue === englishValue);
    return day?.value || englishValue;
  };

  const getEnglishByDisplay = (displayValue: string): string => {
    const day = getDays().find((d) => d.value === displayValue);
    return day?.englishValue || displayValue;
  };

  return {
    getDays,
    getDaysEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay
  };
};
