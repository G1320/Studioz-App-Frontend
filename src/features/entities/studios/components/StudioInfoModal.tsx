import React, { Suspense, useMemo, useState } from 'react';
import { GenericModal } from '@shared/components';
import { LazyMinimap } from '@shared/components/maps';
import { Studio } from 'src/types/index';
import { StudioAvailabilityList } from '@shared/utility-components';
import { useDays } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
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
  const { i18n } = useTranslation();
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

  return (
    <GenericModal open={open} onClose={onClose} className="studio-minimap-modal">
      <div className="studio-minimap-modal__content">
        <div className="studio-minimap-modal__map-wrapper">
          <Suspense
            fallback={
              <div className="map-loader">
                <div className="map-loader__spinner"></div>
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
        </div>

        <section className="studio-minimap-modal__section">
          <div className="studio-minimap-modal__row-between">
            <div>
              <h2 className="studio-minimap-modal__title">{studio?.name.en}</h2>
              {studio?.address && <p className="studio-minimap-modal__address">{studio.address}</p>}
            </div>

            {studio?.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-minimap-modal__link"
              >
                {i18n.language === 'he' ? 'קבל הוראות הגעה' : 'Get directions'}
              </a>
            )}
          </div>
        </section>

        {studio?.phone && (
          <section className="studio-minimap-modal__section">
            <div className="studio-minimap-modal__row-between">
              <span className="studio-minimap-modal__label">{i18n.language === 'he' ? 'טלפון' : 'Phone'}</span>
              <a href={`tel:${studio.phone}`} className="studio-minimap-modal__value studio-minimap-modal__link">
                {studio.phone}
              </a>
            </div>
          </section>
        )}

        {studio?.studioAvailability && (
          <section className="studio-minimap-modal__section">
            <div className="studio-minimap-modal__row-between studio-minimap-modal__row-between--align-start">
              <div>
                <span className="studio-minimap-modal__label">{i18n.language === 'he' ? 'שעות פעילות' : 'Hours'}</span>
                <p className="studio-minimap-modal__sub-label">
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
                    : 'See full schedule'}
              </button>
            </div>

            {showFullHours && (
              <div className="studio-minimap-modal__hours-list">
                <StudioAvailabilityList availability={studio.studioAvailability} variant="list" />
              </div>
            )}
          </section>
        )}
      </div>
    </GenericModal>
  );
};
