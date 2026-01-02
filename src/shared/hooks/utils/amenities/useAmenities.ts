import { useTranslation } from 'react-i18next';
import amenitiesJson from '@core/i18n/locales/en/amenities.json';
import { createTranslationHelpers, TranslationOption } from '@shared/utils/translationUtils';

export interface AmenityOption extends TranslationOption {}

export const useAmenities = () => {
  const { t } = useTranslation('amenities');

  const {
    getOptions: getAmenities,
    getEnglishValues: getAmenitiesEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getEnglishByKey,
    getKeyByEnglish
  } = createTranslationHelpers({
    jsonData: amenitiesJson,
    translationKeyPrefix: '', // Amenities use flat structure
    t
  });

  return {
    getAmenities: (): AmenityOption[] => getAmenities(),
    getAmenitiesEnglish,
    getDisplayByEnglish,
    getEnglishByDisplay,
    getEnglishByKey,
    getKeyByEnglish
  };
};
