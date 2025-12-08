import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReservationCardSkeleton } from './ReservationCardSkeleton';
import './styles/_reservation-details-loading-state.scss';

export const ReservationDetailsLoadingState: React.FC = () => {
  const { t } = useTranslation('reservations');

  return (
    <div className="reservation-details-loading-state">
      <div className="reservation-details-loading-state__content">
        <ReservationCardSkeleton />
        <p className="reservation-details-loading-state__message">{t('loading')}</p>
      </div>
    </div>
  );
};

