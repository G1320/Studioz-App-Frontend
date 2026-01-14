import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { ArrowBackIcon } from '@shared/components/icons';
import './styles/_reservation-details-error-state.scss';

export const ReservationDetailsErrorState: React.FC = () => {
  const { t } = useTranslation('reservations');
  const langNavigate = useLanguageNavigate();

  const handleBack = () => {
    langNavigate('/reservations');
  };

  return (
    <div className="reservation-details-error-state">
      <div className="reservation-details-error-state__content">
        <p className="reservation-details-error-state__message">{t('reservationNotFound')}</p>
        <button onClick={handleBack} className="reservation-details-error-state__back-button">
          <ArrowBackIcon className="reservation-details-error-state__back-icon" />
          <span>{t('backToReservations')}</span>
        </button>
      </div>
    </div>
  );
};
