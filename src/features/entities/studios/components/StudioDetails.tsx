import { useMemo } from 'react';
import { Studio, User } from 'src/types/index';
import { useWishlists } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { StudioDetailsHeader } from './StudioDetailsHeader';
import { StudioDetailsContent } from './StudioDetailsContent';

interface StudioDetailsProps {
  studio?: Studio;
  user?: User;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio, user }) => {
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { userLocation } = useLocationPermission();
  const langNavigate = useLanguageNavigate();

  // Get the current language (default to 'en' if not 'he')

  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !studio?.lat || !studio?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, studio.lat, studio.lng);
  }, [userLocation, studio?.lat, studio?.lng]);

  const handleGoToEdit = (studioId: string) => (studioId ? langNavigate(`/studio/${studioId}/edit`) : null);
  const handleAddNewService = (studioId: string) =>
    studioId ? langNavigate(`/studio/${studioId}/items/create`) : null;

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
