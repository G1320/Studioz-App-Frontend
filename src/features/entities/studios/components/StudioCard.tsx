import { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Studio } from 'src/types/index';
import { usePrefetchStudio } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useModal } from '@core/contexts';
import { calculateDistance } from '@shared/utils/distanceUtils';
import { preloadImage } from '@shared/utils/preloadUtils';
import { ShareModal } from '@shared/components';
import { StudioFeatures } from './StudioFeatures';
import { StudioCardHeader } from './StudioCardHeader';
import ShareIcon from '@mui/icons-material/Share';
import '../styles/_studio-card.scss';

interface StudioCardProps {
  studio?: Studio;
  navActive?: boolean;
}

export const StudioCard: React.FC<StudioCardProps> = ({ studio, navActive = true }) => {
  const { i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();
  const prefetchStudio = usePrefetchStudio(studio?._id || '');
  const { userLocation } = useLocationPermission();
  const { loadingStudioId, setLoadingStudioId } = useModal();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const isLoading = loadingStudioId === studio?._id;

  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !studio?.lat || !studio?.lng) {
      return null;
    }
    return calculateDistance(userLocation.latitude, userLocation.longitude, studio.lat, studio.lng);
  }, [userLocation, studio?.lat, studio?.lng]);

  const handleClick = useCallback(async () => {
    if (!navActive || !studio?._id) return;

    // Set loading state
    setLoadingStudioId(studio._id);

    try {
      // Preload the cover image if available
      if (studio.coverImage) {
        await preloadImage(studio.coverImage);
      }

      // Also preload gallery images if available (first few)
      if (studio.galleryImages && studio.galleryImages.length > 0) {
        const imagesToPreload = studio.galleryImages.slice(0, 3);
        await Promise.all(imagesToPreload.map((img: string) => preloadImage(img)));
      }
    } catch (error) {
      // If preloading fails, still navigate
      console.error('Error preloading studio images:', error);
    }

    // Clear loading and navigate
    setLoadingStudioId(null);
    langNavigate(`/studio/${studio._id}`);
  }, [navActive, studio, setLoadingStudioId, langNavigate]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    setShareModalOpen(true);
  }, []);

  const studioName = i18n.language === 'he' ? studio?.name?.he || studio?.name?.en : studio?.name?.en;
  const shareUrl = `${window.location.origin}/${i18n.language}/studio/${studio?._id}`;

  return (
    <>
      <article
        onMouseEnter={prefetchStudio}
        onClick={handleClick}
        key={studio?._id}
        className={`card studio-card ${isLoading ? 'studio-card--loading' : ''}`}
      >
        {isLoading && (
          <div className="studio-card__loading-overlay">
            <div className="studio-card__spinner" />
          </div>
        )}
        <StudioCardHeader studio={studio} />
        <div className="studio-card-name-and-description">
          <h3 className="title">{studioName}</h3>
          <p className="description">
            {(studio?.address || studio?.description?.en || '')
              .replace(/,?\s*Israel$/i, '')
              .replace(/,?\s*\d{5,7}$/, '') // Remove zip codes (5-7 digits at end)
              .trim()}
          </p>
        </div>
        <div className="studio-card__footer">
          <StudioFeatures
            studio={studio}
            showSmoking={false}
            // showAccessible={true}
            averageRating={studio?.averageRating}
            reviewCount={studio?.reviewCount}
            distance={distance}
          />
          <button
            className="studio-card__share-btn"
            onClick={handleShare}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Share studio"
            type="button"
          >
            <ShareIcon />
          </button>
        </div>
      </article>

      {/* Share Modal - outside article to prevent event bubbling */}
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={shareUrl}
        title={studioName || ''}
      />
    </>
  );
};
