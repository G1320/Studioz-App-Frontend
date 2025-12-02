import { useMemo } from 'react';
import { SmokingRooms, Check, Close, Accessible } from '@mui/icons-material';
import ChairIcon from '@mui/icons-material/Chair';
import { GenericImageGallery, StudioRating, DistanceBadge } from '@shared/components';
import { Studio } from 'src/types/index';
import { usePrefetchStudio } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { calculateDistance } from '@shared/utils/distanceUtils';

interface StudioPreviewProps {
  studio?: Studio;
  navActive?: boolean;
}

export const StudioPreview: React.FC<StudioPreviewProps> = ({ studio, navActive = true }) => {
  const langNavigate = useLanguageNavigate();
  const prefetchStudio = usePrefetchStudio(studio?._id || '');
  const { i18n } = useTranslation();
  const { userLocation } = useLocationPermission();

  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !studio?.lat || !studio?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, studio.lat, studio.lng);
  }, [userLocation, studio?.lat, studio?.lng]);

  const getServicesText = (count: number) => {
    return i18n.language === 'he' ? `שירותים זמינים: ${count}` : `Services Available: ${count}`;
  };

  return (
    <article
      onMouseEnter={prefetchStudio}
      onClick={() => (navActive ? langNavigate(`/studio/${studio?._id}`) : null)}
      key={studio?._id}
      className="preview studio-preview"
    >
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={false}
      />

      <div className="studio-preview-name-and-city">
        <h3 className="title">{studio?.name?.en}</h3>
        <small className="city">{studio?.city}</small>
      </div>
      <div className="studio-preview__rating-overlay">
        <StudioRating
          averageRating={studio?.averageRating}
          reviewCount={studio?.reviewCount}
          variant="badge"
          showCount={false}
        />
        {distance !== null && <DistanceBadge distance={distance} />}
      </div>

      <p className="description">{studio?.description?.en}</p>
      <div className="options-wrapper">
        <div role="group" aria-labelledby="occupancy">
          <ChairIcon aria-label="Chair icon" />
          <span
            id="occupancy"
            aria-label={`Maximum occupancy for ${studio?.name?.en}: ${studio?.maxOccupancy || 0} people`}
          >
            {studio?.maxOccupancy || 0}
          </span>
        </div>
        <div role="group" aria-labelledby="smoking">
          <SmokingRooms aria-label="Smoking icon" />
          <span
            id="smoking"
            aria-label={`Smoking allowed at ${studio?.name?.en}: ${studio?.isSmokingAllowed ? 'Yes' : 'No'}`}
          >
            {studio?.isSmokingAllowed ? <Check /> : <Close />}
          </span>
        </div>
        <div role="group" aria-labelledby="accessible">
          <Accessible aria-label="Wheelchair accessible icon" />
          <span
            id="accessible"
            aria-label={`Wheelchair accessible at ${studio?.name.en}: ${studio?.isWheelchairAccessible ? 'Yes' : 'No'}`}
          >
            {studio?.isWheelchairAccessible ? <Check /> : <Close />}
          </span>
        </div>

        <small>{getServicesText(studio?.items.length || 0)}</small>
      </div>
    </article>
  );
};
