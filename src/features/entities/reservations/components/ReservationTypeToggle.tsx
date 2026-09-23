import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles/_reservation-type-toggle.scss';

export type ReservationViewType = 'incoming' | 'outgoing' | 'all';

interface ReservationTypeToggleProps {
  viewType: ReservationViewType;
  onViewTypeChange: (type: ReservationViewType) => void;
  className?: string;
}

export const ReservationTypeToggle: React.FC<ReservationTypeToggleProps> = ({
  viewType,
  onViewTypeChange,
  className = ''
}) => {
  const { t } = useTranslation('reservations');

  return (
    <div className={`reservation-type-toggle ${className}`} role="group" aria-label={t('toggle.all')}>
      <button
        type="button"
        className={`reservation-type-toggle__button reservation-type-toggle__button--all ${viewType === 'all' ? 'active' : ''}`}
        onClick={() => onViewTypeChange('all')}
      >
        {t('toggle.all')}
      </button>
      <button
        type="button"
        className={`reservation-type-toggle__button ${viewType === 'outgoing' ? 'active' : ''}`}
        onClick={() => onViewTypeChange('outgoing')}
      >
        {t('toggle.myBookings')}
      </button>
      <button
        type="button"
        className={`reservation-type-toggle__button ${viewType === 'incoming' ? 'active' : ''}`}
        onClick={() => onViewTypeChange('incoming')}
      >
        {t('toggle.studioReservations')}
      </button>
    </div>
  );
};
