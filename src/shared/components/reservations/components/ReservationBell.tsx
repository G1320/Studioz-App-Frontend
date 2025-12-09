import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTranslation } from 'react-i18next';
import { useReservationsList, useStudios } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { hasStoredReservations } from '@shared/utils/reservation-storage';
import { useMemo } from 'react';
import '../styles/reservation-bell.scss';

export const ReservationBell: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { user } = useUserContext();
  const { data: allStudios = [] } = useStudios();
  const location = useLocation();
  const currLang = i18n.language || 'en';

  // Get user's studios to determine if they're a studio owner
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return allStudios.filter((studio) => studio.createdBy === user._id);
  }, [allStudios, user?._id]);

  const isStudioOwner = userStudios.length > 0;

  // Check if user is logged in or has stored reservations
  const hasAccess = user?._id || hasStoredReservations();

  // Fetch reservations to get count
  const { data: reservations = [] } = useReservationsList({
    useStoredIds: hasStoredReservations() && !user?._id,
    userStudios: isStudioOwner ? userStudios : [],
    filters: {
      status: 'all',
      type: 'all'
    }
  });

  const reservationCount = reservations.length;

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

