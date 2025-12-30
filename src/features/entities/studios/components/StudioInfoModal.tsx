import React, { Suspense, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenericModal } from '@shared/components';
import { LazyMinimap } from '@shared/components/maps';
import { Studio } from 'src/types/index';
import { StudioAvailabilityList } from '@shared/utility-components';
import { useDays } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import NearMeIcon from '@mui/icons-material/NearMe';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import '../styles/_studio-minimap-modal.scss';

interface StudioInfoModalProps {
  open: boolean;
  onClose: () => void;
  studio?: Studio;
}

export const StudioInfoModal: React.FC<StudioInfoModalProps> = ({ open, onClose, studio }) => {
  if (!studio?.lat || !studio?.lng) {
    return null;
  }

  const [showFullHours, setShowFullHours] = useState(false);
  const { i18n } = useTranslation('studios');
  const { getDisplayByEnglish } = useDays();

  const todayLabelAndHours = useMemo(() => {
    if (!studio?.studioAvailability || !studio.studioAvailability.days?.length) {
      return null;
    }

    const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
    const todayIndex = new Date().getDay();
    const todayEnglish = allDays[todayIndex];

    const availabilityIndex = studio.studioAvailability.days.indexOf(todayEnglish);

    const displayDay = getDisplayByEnglish(todayEnglish);

    if (availabilityIndex === -1) {
      return {
        label: displayDay,
        value: i18n.language === 'he' ? 'סגור' : 'Closed'
      };
    }

    const timeRange = studio.studioAvailability.times[availabilityIndex];
    const value =
      i18n.language === 'he'
        ? `${timeRange?.end ?? ''} - ${timeRange?.start ?? ''}`
        : `${timeRange?.start ?? ''} - ${timeRange?.end ?? ''}`;

    return {
      label: displayDay,
      value
    };
  }, [getDisplayByEnglish, i18n.language, studio?.studioAvailability]);

  const studioName = i18n.language === 'he' && studio?.name?.he ? studio.name.he : studio?.name?.en;

  return (
    <GenericModal open={open} onClose={onClose} className="studio-minimap-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="studio-minimap-modal__content"
      >
        {/* Map Section */}
        <div className="studio-minimap-modal__map-wrapper">
          <Suspense
            fallback={
              <div className="studio-minimap-modal__map-loader">
                <div className="studio-minimap-modal__map-loader-spinner" />
              </div>
            }
          >
            <LazyMinimap
              latitude={studio.lat!}
              longitude={studio.lng!}
              width="100%"
              height="260px"
              className="studio-minimap-modal__map"
            />
          </Suspense>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="studio-minimap-modal__close-button"
            aria-label={i18n.language === 'he' ? 'סגור' : 'Close'}
          >
            <CloseIcon className="studio-minimap-modal__close-icon" />
          </button>
        </div>

        {/* Info Content */}
        <div className="studio-minimap-modal__info">
          {/* Header */}
          <div className="studio-minimap-modal__header">
            <h2 className="studio-minimap-modal__title">{studioName}</h2>

            <div className="studio-minimap-modal__address-row">
              {studio?.address && <p className="studio-minimap-modal__address">{studio.address}</p>}

              {studio?.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio-minimap-modal__directions-link"
                  data-rtl={i18n.language === 'he' ? 'true' : 'false'}
                >
                  {i18n.language === 'he' ? 'קבל הוראות הגעה' : 'Get directions'}
                  <NearMeIcon className="studio-minimap-modal__directions-icon" />
                </a>
              )}
            </div>

            {/* Contact Links */}
            <div className="studio-minimap-modal__contact-list">
              {studio?.phone && (
                <a href={`tel:${studio.phone}`} className="studio-minimap-modal__contact-row">
                  <div className="studio-minimap-modal__contact-icon-wrapper">
                    <PhoneIcon className="studio-minimap-modal__contact-icon" />
                  </div>
                  <span className="studio-minimap-modal__contact-text">{studio.phone}</span>
                </a>
              )}

              {studio?.website && (
                <a
                  href={studio.website.startsWith('http') ? studio.website : `https://${studio.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio-minimap-modal__contact-row"
                >
                  <div className="studio-minimap-modal__contact-icon-wrapper">
                    <LanguageIcon className="studio-minimap-modal__contact-icon" />
                  </div>
                  <span className="studio-minimap-modal__contact-text">
                    {studio.website.replace(/^https?:\/\//, '')}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="studio-minimap-modal__divider" />

          {/* Hours Section */}
          {studio?.studioAvailability && (
            <div className="studio-minimap-modal__hours-section">
              <div className="studio-minimap-modal__hours-header">
                <div className="studio-minimap-modal__hours-info">
                  <span className="studio-minimap-modal__hours-label">
                    {i18n.language === 'he' ? 'שעות פעילות' : 'Hours'}
                  </span>
                  <p className="studio-minimap-modal__hours-today">
                    {todayLabelAndHours
                      ? `${i18n.language === 'he' ? 'היום' : 'Today'} · ${todayLabelAndHours.value}`
                      : i18n.language === 'he'
                        ? 'ללא שעות פעילות'
                        : 'No business hours'}
                  </p>
                </div>

                <button
                  type="button"
                  className="studio-minimap-modal__hours-toggle"
                  onClick={() => setShowFullHours((prev) => !prev)}
                >
                  {showFullHours
                    ? i18n.language === 'he'
                      ? 'סגור שעות שבועיות'
                      : 'Hide weekly hours'
                    : i18n.language === 'he'
                      ? 'ראה שעות שבועיות'
                      : 'Show weekly hours'}
                </button>
              </div>

              <AnimatePresence>
                {showFullHours && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="studio-minimap-modal__hours-list-wrapper"
                  >
                    <div className="studio-minimap-modal__hours-list">
                      <StudioAvailabilityList availability={studio.studioAvailability} variant="list" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </GenericModal>
  );
};
