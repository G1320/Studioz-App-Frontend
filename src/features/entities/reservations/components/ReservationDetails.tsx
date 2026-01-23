import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useReservation, useStudios } from '@shared/hooks';
import { useUserContext, useReservationModal } from '@core/contexts';
import { ReservationCard } from './ReservationCard';
import './styles/_reservation-details.scss';

interface ReservationDetailsProps {
  reservationId: string;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservationId }) => {
  const { t } = useTranslation('reservations');
  const { user } = useUserContext();
  const { closeReservationModal } = useReservationModal();
  const { data: allStudios = [], isLoading: isLoadingStudios } = useStudios();
  const { data: reservation, isLoading: isLoadingReservation, error } = useReservation(reservationId);

  // Get user's studios for studio owner actions
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return allStudios?.filter((studio) => studio.createdBy === user._id);
  }, [allStudios, user?._id]);

  const isLoading = isLoadingReservation || isLoadingStudios;

  if (isLoading) {
    return (
      <article className="reservation-details">
        <div className="reservation-details__loading">
          <p>{t('loading')}</p>
        </div>
      </article>
    );
  }

  if (error || !reservation) {
    return (
      <article className="reservation-details">
        <div className="reservation-details__error">
          <p>{t('reservationNotFound')}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="reservation-details">
      <ReservationCard 
        reservation={reservation} 
        variant="itemCard" 
        userStudios={userStudios}
        onCancel={closeReservationModal}
      />
    </article>
  );
};
