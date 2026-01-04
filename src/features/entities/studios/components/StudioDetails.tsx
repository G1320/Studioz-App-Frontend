import { useMemo } from 'react';
import { Studio, User } from 'src/types/index';
import { useWishlists } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { StudioDetailsHeader } from './StudioDetailsHeader';
import { StudioDetailsContent } from './StudioDetailsContent';
import { useTranslation } from 'react-i18next';

interface StudioDetailsProps {
  studio?: Studio;
  user?: User;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio, user }) => {
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { i18n } = useTranslation('forms');
  const { userLocation } = useLocationPermission();
  const langNavigate = useLanguageNavigate();

  // Get the current language (default to 'en' if not 'he')
  const currentLang = i18n.language === 'he' ? 'he' : 'en';

  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !studio?.lat || !studio?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, studio.lat, studio.lng);
  }, [userLocation, studio?.lat, studio?.lng]);

  const handleGoToEdit = (studioId: string) => (studioId ? langNavigate(`/edit-studio/${studioId}`) : null);
  const handleAddNewService = (studioId: string) =>
    studioId ? langNavigate(`/create-item/${studio?.name[currentLang] || studio?.name.en}/${studioId}`) : null;

  return (
    <article key={studio?._id} className="details studio-details">
      <StudioDetailsHeader
        studio={studio}
        user={user}
        wishlists={wishlists}
        distance={distance}
        onEdit={handleGoToEdit}
        onAddNewService={handleAddNewService}
      />

      <StudioDetailsContent studio={studio} />
    </article>
  );
};
