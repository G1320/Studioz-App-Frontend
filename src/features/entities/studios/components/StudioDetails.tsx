import { useState, useMemo } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { GenericImageGallery } from '@shared/components';
import { Studio, User } from 'src/types/index';
import { useWishlists, useGenres } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { StudioOptions } from './StudioOptions';
import { StudioInfoModal } from './StudioInfoModal';
import { StudioFeatures } from './StudioFeatures';
import { GenreCard } from '@features/entities/genres';
import { useTranslation } from 'react-i18next';

interface StudioDetailsProps {
  studio?: Studio;
  user?: User;
}

export const StudioDetails: React.FC<StudioDetailsProps> = ({ studio, user }) => {
  const { data: wishlists = [] } = useWishlists(user?._id || '');
  const { getDisplayByEnglish } = useGenres();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { i18n } = useTranslation('forms');
  const { userLocation } = useLocationPermission();

  // Get the current language (default to 'en' if not 'he')
  const currentLang = i18n.language === 'he' ? 'he' : 'en';

  const langNavigate = useLanguageNavigate();

  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !studio?.lat || !studio?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, studio.lat, studio.lng);
  }, [userLocation, studio?.lat, studio?.lng]);

  // const getParkingLabel = (parking: string) => {
  //   const options: Record<string, string> = {
  //     private: t('form.parking.options.private') || 'Private Spot',
  //     street: t('form.parking.options.street') || 'Street Parking',
  //     paid: t('form.parking.options.paid') || 'Paid Garage',
  //     none: t('form.parking.options.none') || 'No Parking'
  //   };
  //   return options[parking] || options.none;
  // };

  // Convert English genre values to display values
  const displayGenres = studio?.genres?.map((englishValue) => getDisplayByEnglish(englishValue)) || [];

  const handleGoToEdit = (studioId: string) => (studioId ? langNavigate(`/edit-studio/${studioId}`) : null);
  const handleAddNewService = (studioId: string) =>
    studioId ? langNavigate(`/create-item/${studio?.name[currentLang] || studio?.name.en}/${studioId}`) : null;

  const hasLocation = studio?.lat !== undefined && studio?.lng !== undefined;

  return (
    <article key={studio?._id} className="details studio-details">
      <GenericImageGallery
        entity={studio}
        coverImage={studio?.coverImage}
        galleryImages={studio?.galleryImages}
        isGalleryImagesShown={true}
        title={studio?.name.en}
        subTitle={studio?.city}
      />

      <div className="info-option-container">
        <StudioFeatures
          studio={studio}
          showSmoking={true}
          showAccessible={true}
          averageRating={studio?.averageRating}
          reviewCount={studio?.reviewCount}
          distance={distance}
        />
        <div className="studio-options-container">
          <StudioOptions
            studio={studio as Studio}
            user={user as User}
            wishlists={wishlists}
            onEdit={handleGoToEdit}
            onAddNewService={handleAddNewService}
          />
          {hasLocation && (
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="studio-info-modal-button"
              aria-label={`View ${studio?.name[currentLang] || studio?.name.en} information and map`}
            >
              <InfoOutlined aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <p className="description">{studio?.description[currentLang] || studio?.description.en}</p>
      {displayGenres.length > 0 && (
        <div className="studio-genres">
          {displayGenres.slice(0, 8).map((genre, index) => (
            <GenreCard key={index} genre={genre} pathPrefix="studios" isInteractive={false} />
          ))}
        </div>
      )}

      {/* {studio?.parking && studio.parking !== 'none' && (
        <div role="group" aria-labelledby="parking">
          <LocalParking aria-label="Parking icon" />
          <p
            id="parking"
            aria-label={`Parking at ${studio?.name[currentLang] || studio?.name.en}: ${getParkingLabel(studio.parking)}`}
          >
            {getParkingLabel(studio.parking)}
          </p>
        </div>
      )} */}
      <StudioInfoModal open={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} studio={studio} />
    </article>
  );
};
