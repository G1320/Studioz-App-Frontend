import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '@shared/hooks';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { Reservation } from 'src/types/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import 'dayjs/locale/he';
import { ClockIcon, CalendarTodayIcon, ScheduleIcon } from '@shared/components/icons';
import '../styles/_recent-activity.scss';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

interface RecentActivityProps {
  /** Maximum number of activities to show */
  limit?: number;
  /** Filter by user's studios (for studio owners) */
  studioIds?: string[];
  /** Whether the user is a studio owner */
  isStudioOwner?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ limit = 4, studioIds = [], isStudioOwner = false }) => {
  const { t, i18n } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data: reservations = [], isLoading } = useReservations();
  const { openReservationModal } = useReservationModal();

  // Set dayjs locale
  dayjs.locale(i18n.language);

  // Filter and sort reservations
  const recentActivities = useMemo(() => {
    let filtered = [...reservations];

    // For studio owners, filter by their studio items
    if (isStudioOwner && studioIds.length > 0) {
      // This would need to be filtered by studio items
      // For now, we show all reservations the owner has access to
    }

    // Sort by creation date (most recent first)
    filtered.sort((a, b) => {
      const getTimestamp = (r: Reservation) => {
        if (r.createdAt) {
          return dayjs(r.createdAt).valueOf();
        }
        return dayjs(r.bookingDate, 'DD/MM/YYYY').valueOf();
      };
      
      return getTimestamp(b) - getTimestamp(a);
    });

    // Limit results
    return filtered.slice(0, limit);
  }, [reservations, studioIds, isStudioOwner, limit]);

  const getStatusClass = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'confirmed':
      case 'approved':
        return 'status--confirmed';
      case 'pending':
      case 'waiting':
        return 'status--pending';
      case 'completed':
        return 'status--completed';
      case 'cancelled':
      case 'rejected':
      case 'expired':
        return 'status--cancelled';
      default:
        return 'status--pending';
    }
  };

  const formatDate = (reservation: Reservation) => {
    const bookingDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY');
    const timeSlot = reservation.timeSlots?.[0] || '';

    if (bookingDate.isToday()) {
      return `${t('recentActivity.today')}, ${timeSlot}`;
    } else if (bookingDate.isTomorrow()) {
      return `${t('recentActivity.tomorrow')}, ${timeSlot}`;
    }

    return `${bookingDate.format('DD/MM')}, ${timeSlot}`;
  };

  const formatDuration = (reservation: Reservation) => {
    // Use timeSlots length for accurate hours (each slot = 1 hour)
    const hours = reservation.timeSlots?.length || reservation.quantity || 1;
    return `${hours}${t('recentActivity.hours')}`;
  };

  const getActivityMessage = (reservation: Reservation) => {
    const itemName =
      i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';

    return t('recentActivity.bookedAt', { item: itemName });
  };

  const handleActivityClick = (reservation: Reservation) => {
    openReservationModal(reservation);
  };

  const handleViewHistory = () => {
    navigate('/reservations');
  };

  if (isLoading) {
    return (
      <div className="recent-activity">
        <div className="recent-activity__header">
          <h2 className="recent-activity__title">
            <ClockIcon className="recent-activity__title-icon" />
            {t('recentActivity.title')}
          </h2>
        </div>
        <div className="recent-activity__container">
          <div className="recent-activity__loading">{t('recentActivity.loading')}</div>
        </div>
      </div>
    );
  }

  if (recentActivities.length === 0) {
    return (
      <div className="recent-activity">
        <div className="recent-activity__header">
          <h2 className="recent-activity__title">
            <ClockIcon className="recent-activity__title-icon" />
            {t('recentActivity.title')}
          </h2>
        </div>
        <div className="recent-activity__container">
          <div className="recent-activity__empty">{t('recentActivity.empty')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="recent-activity__header">
        <h2 className="recent-activity__title">
          <ClockIcon className="recent-activity__title-icon" />
          {t('recentActivity.title')}
        </h2>
      </div>

      <div className="recent-activity__container">
        <div className="recent-activity__list">
          {recentActivities.map((reservation, index) => (
            <div
              key={reservation._id}
              className={`recent-activity__item ${index === recentActivities.length - 1 ? 'recent-activity__item--last' : ''}`}
              onClick={() => handleActivityClick(reservation)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleActivityClick(reservation)}
            >
              {/* Timeline Line */}
              {index < recentActivities.length - 1 && <div className="recent-activity__timeline-line" />}

              {/* Status Indicator */}
              <div className="recent-activity__status-indicator">
                <div className={`recent-activity__status-dot ${getStatusClass(reservation.status)}`} />
              </div>

              {/* Content */}
              <div className="recent-activity__content">
                <div className="recent-activity__content-header">
                  <h4 className="recent-activity__client-name">
                    {reservation.customerName || t('recentActivity.anonymousClient')}
                  </h4>
                  <span className="recent-activity__amount">₪{reservation.totalPrice?.toLocaleString() || 0}</span>
                </div>

                <p className="recent-activity__description">{getActivityMessage(reservation)}</p>

                <div className="recent-activity__meta">
                  <span className="recent-activity__meta-item">
                    <CalendarTodayIcon className="recent-activity__meta-icon" />
                    {formatDate(reservation)}
                  </span>
                  <span className="recent-activity__meta-item">
                    <ScheduleIcon className="recent-activity__meta-icon" />
                    {formatDuration(reservation)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="recent-activity__view-all" onClick={handleViewHistory}>
          {t('recentActivity.viewAll')}
        </button>
      </div>
    </div>
  );
};
