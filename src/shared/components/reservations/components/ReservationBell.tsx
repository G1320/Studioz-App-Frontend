import React from 'react';
import { Link } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTranslation } from 'react-i18next';
import { useReservationsList, useStudios } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { hasStoredReservations } from '@shared/utils/reservation-storage';
import { getActiveReservationsCount } from '@shared/utils/reservation-utils';
import { useMemo } from 'react';
import '../styles/reservation-bell.scss';

export const ReservationBell: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { user } = useUserContext();
  const { data: allStudios = [] } = useStudios();
  const currLang = i18n.language || 'en';

  // Get user's studios to determine if they're a studio owner
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return allStudios.filter((studio) => studio.createdBy === user._id);
  }, [allStudios, user?._id]);

  const isStudioOwner = userStudios.length > 0;

  // Check if user is logged in or has stored reservations

  // Fetch reservations to get count
  const { data: reservations = [] } = useReservationsList({
    useStoredIds: hasStoredReservations() && !user?._id,
    userStudios: isStudioOwner ? userStudios : [],
    filters: {
      status: 'all',
      type: 'all'
    }
  });

  // Get count of active reservations (confirmed/pending that haven't ended more than 3 hours ago)
  const reservationCount = useMemo(() => {
    return getActiveReservationsCount(reservations, 3);
  }, [reservations]);

  return (
    <Link
      to={`${currLang}/reservations`}
      className="reservation-bell__button"
      aria-label={`${t('navigation.reservations', 'My Reservations')}${reservationCount > 0 ? ` (${reservationCount})` : ''}`}
    >
      <EventNoteIcon className="reservation-bell__icon" />
      {reservationCount > 0 && (
        <span className="reservation-bell__badge" aria-label={`${reservationCount} reservations`}>
          {reservationCount > 99 ? '99+' : reservationCount}
        </span>
      )}
    </Link>
  );
};
