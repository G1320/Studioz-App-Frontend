import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useReservation, useStudios } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { ReservationCard } from './ReservationCard';
import { ReservationActions } from './ReservationActions';
import './styles/_reservation-details.scss';

interface ReservationDetailsProps {
  reservationId: string;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservationId }) => {
  const { t } = useTranslation('reservations');
  const { user } = useUserContext();
  const { data: allStudios = [] } = useStudios();
  const { data: reservation, isLoading, error } = useReservation(reservationId);

  // Get user's studios for studio owner actions
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return allStudios.filter((studio) => studio.createdBy === user._id);
  }, [allStudios, user?._id]);

  const { closeReservationModal } = useReservationModal();
  
  const handleClose = () => {
    closeReservationModal();
  };

  if (isLoading) {
    return (
      <article className="reservation-details">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
        <div className="reservation-details__loading">
          <p>{t('loading')}</p>
        </div>
      </article>
    );
  }

  if (error || !reservation) {
    return (
      <article className="reservation-details">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
        <div className="reservation-details__error">
          <p>{t('reservationNotFound')}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="reservation-details">
      <button className="close-button" onClick={handleClose}>
        ×
      </button>
      <ReservationCard reservation={reservation} variant="itemCard" />
      <div className="reservation-details__actions">
        <ReservationActions
          reservation={reservation}
          userStudios={userStudios}
          onCancel={handleClose}
        />
      </div>
    </article>
  );
};

