import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useReservation, useStudios } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import {
  ReservationDetailsHeader,
  ReservationDetailsInfoSection,
  ReservationDetailsActionsSection,
  ReservationDetailsLoadingState,
  ReservationDetailsErrorState
} from '../components';
import './styles/_reservation-details-page.scss';

const ReservationDetailsPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const langNavigate = useLanguageNavigate();
  const { user } = useUserContext();
  const { data: allStudios = [] } = useStudios();

  const { data: reservation, isLoading, error } = useReservation(reservationId || '');

  // Get user's studios for studio owner actions
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return allStudios.filter((studio) => studio.createdBy === user._id);
  }, [allStudios, user?._id]);

  const handleBack = () => {
    langNavigate('/reservations');
  };

  if (isLoading) {
    return (
      <div className="reservation-details-page">
        <ReservationDetailsLoadingState />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="reservation-details-page">
        <ReservationDetailsErrorState />
      </div>
    );
  }

  return (
    <div className="reservation-details-page">
      <ReservationDetailsHeader onBack={handleBack} />
      <div className="reservation-details-page__content">
        <ReservationDetailsInfoSection reservation={reservation} />
        <ReservationDetailsActionsSection
          reservation={reservation}
          userStudios={userStudios}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
};

export default ReservationDetailsPage;

