import { useTranslation } from 'react-i18next';
import genresJson from '@core/i18n/locales/en/genres.json';
import { createTranslationHelpers, TranslationOption } from '@shared/utils/translationUtils';

export interface GenreOption extends TranslationOption {}

export const useGenres = () => {
  const { t } = useTranslation('genres');

  const {
    getOptions: getGenres,
    getEnglishValues: getGenresEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getEnglishByKey,
    getKeyByEnglish
  } = createTranslationHelpers({
    jsonData: genresJson,
    translationKeyPrefix: '', // Genres use flat structure
    t
  });

  return {
    getGenres: (): GenreOption[] => getGenres(),
    getGenresEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getEnglishByKey,
    getKeyByEnglish
  };
};
