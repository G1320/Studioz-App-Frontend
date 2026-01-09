import { useState } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { GenericImageGallery } from '@shared/components';
import { Studio, User, Wishlist } from 'src/types/index';
import { StudioOptions } from './StudioOptions';
import { StudioInfoModal } from './StudioInfoModal';
import { StudioFeatures } from './StudioFeatures';
import { useTranslation } from 'react-i18next';
import { isFeatureEnabled } from '@core/config/featureFlags';

interface StudioDetailsHeaderProps {
  studio?: Studio;
  user?: User;
  wishlists: Wishlist[];
  distance: number | null;
  onEdit: (studioId: string) => void;
  onAddNewService: (studioId: string) => void;
}

export const StudioDetailsHeader: React.FC<StudioDetailsHeaderProps> = ({
  studio,
  user,
  wishlists,
  distance,
  onEdit,
  onAddNewService
}) => {
  const { i18n } = useTranslation('forms');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const currentLang = i18n.language === 'he' ? 'he' : 'en';
  const hasLocation = studio?.lat !== undefined && studio?.lng !== undefined;
  const showInfoModal = isFeatureEnabled('studioInfoModal');

  return (
    <header className="studio-details__header">
      <GenericImageGallery
        entity={studio}
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
            onEdit={onEdit}
            onAddNewService={onAddNewService}
          />
          {showInfoModal && hasLocation && (
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

      {showInfoModal && (
        <StudioInfoModal open={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} studio={studio} />
      )}
    </header>
  );
};
