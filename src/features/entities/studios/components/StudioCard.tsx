import { useMemo } from 'react';
import { GenericImageGallery } from '@shared/components';
import { Studio } from 'src/types/index';
import { usePrefetchStudio } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { StudioFeatures } from './StudioFeatures';
import '../styles/_studio-card.scss';

interface StudioCardProps {
  studio?: Studio;
  navActive?: boolean;
}

export const StudioCard: React.FC<StudioCardProps> = ({ studio, navActive = true }) => {
  const langNavigate = useLanguageNavigate();
  const prefetchStudio = usePrefetchStudio(studio?._id || '');
  const { userLocation } = useLocationPermission();

  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !studio?.lat || !studio?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, studio.lat, studio.lng);
  }, [userLocation, studio?.lat, studio?.lng]);

  return (
    <article
      onMouseEnter={prefetchStudio}
      onClick={() => (navActive ? langNavigate(`/studio/${studio?._id}`) : null)}
      key={studio?._id}
      className="card studio-card"
    >
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={false}
      />

      <h3 className="title">{studio?.name?.en}</h3>

      <p className="description">{studio?.description?.en}</p>
      <StudioFeatures
        studio={studio}
        showSmoking={false}
        averageRating={studio?.averageRating}
        reviewCount={studio?.reviewCount}
        distance={distance}
      />
    </article>
  );
};
