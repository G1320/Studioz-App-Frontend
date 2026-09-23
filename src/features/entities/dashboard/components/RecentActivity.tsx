import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRemoteProjects, useReservations } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { RemoteProject, Reservation } from 'src/types/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import 'dayjs/locale/he';
import { CalendarTodayIcon, ScheduleIcon } from '@shared/components/icons';
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

type RecentActivityItem =
  | { kind: 'reservation'; timestamp: number; reservation: Reservation }
  | { kind: 'project'; timestamp: number; project: RemoteProject };

export const RecentActivity: React.FC<RecentActivityProps> = ({ limit = 4, studioIds = [], isStudioOwner = false }) => {
  const { t, i18n } = useTranslation('dashboard');
  const { t: tProjects } = useTranslation('remoteProjects');
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();
  const { projects, isLoading: projectsLoading } = useRemoteProjects({
    participantId: user?._id,
    limit: Math.max(limit * 4, 20)
  });
  const { openReservationModal } = useReservationModal();

  // Set dayjs locale
  dayjs.locale(i18n.language);

  const recentActivities = useMemo<RecentActivityItem[]>(() => {
    const reservationActivities: RecentActivityItem[] = reservations.map((reservation) => ({
      kind: 'reservation',
      reservation,
      timestamp: reservation.createdAt
        ? dayjs(reservation.createdAt).valueOf()
        : dayjs(reservation.bookingDate, 'DD/MM/YYYY').valueOf()
    }));

    const visibleProjects =
      isStudioOwner && studioIds.length > 0
        ? projects.filter((project) => {
            const studioId = typeof project.studioId === 'string' ? project.studioId : project.studioId._id;
            return studioIds.includes(studioId);
          })
        : projects;

    const projectActivities: RecentActivityItem[] = visibleProjects.map((project) => ({
      kind: 'project',
      project,
      timestamp: dayjs(project.updatedAt || project.createdAt).valueOf()
    }));

    return [...reservationActivities, ...projectActivities].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }, [reservations, projects, studioIds, isStudioOwner, limit]);

  const getStatusClass = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'confirmed':
      case 'approved':
      case 'accepted':
      case 'delivered':
        return 'status--confirmed';
      case 'pending':
      case 'waiting':
      case 'requested':
      case 'in_progress':
      case 'revision_requested':
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

  const getStudioName = (reservation: Reservation) => {
    if (i18n.language === 'he' && reservation.studioName?.he) return reservation.studioName.he;
    return reservation.studioName?.en || '';
  };

  const getActivityMessage = (reservation: Reservation) => {
    const itemName =
      i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';

    return t('recentActivity.bookedAt', { item: itemName });
  };

  const getProjectStudioName = (project: RemoteProject) => {
    const name = project.studioName || (typeof project.studioId === 'object' ? project.studioId.name : undefined);
    if (i18n.language === 'he' && name?.he) return name.he;
    return name?.en || name?.he || '';
  };

  const getProjectStatusLabel = (status: RemoteProject['status']) => {
    const keys: Record<RemoteProject['status'], string> = {
      requested: 'requested',
      accepted: 'accepted',
      in_progress: 'inProgress',
      delivered: 'delivered',
      revision_requested: 'revisionRequested',
      completed: 'completed',
      cancelled: 'cancelled',
      declined: 'declined'
    };
    return tProjects(`status.${keys[status]}`);
  };

  const handleActivityClick = (activity: RecentActivityItem) => {
    if (activity.kind === 'reservation') {
      openReservationModal(activity.reservation);
      return;
    }
    navigate(`/${i18n.language}/projects/${activity.project._id}`);
  };

  if (reservationsLoading || projectsLoading) {
    return (
      <div className="recent-activity">
        <div className="recent-activity__container">
          <div className="recent-activity__loading">{t('recentActivity.loading')}</div>
        </div>
      </div>
    );
  }

  if (recentActivities.length === 0) {
    return (
      <div className="recent-activity">
        <div className="recent-activity__container">
          <div className="recent-activity__empty">{t('recentActivity.empty')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="recent-activity__container">
        <div className="recent-activity__list">
          {recentActivities.map((activity, index) => {
            const isReservation = activity.kind === 'reservation';
            const entity = isReservation ? activity.reservation : activity.project;
            const customerName = isReservation
              ? activity.reservation.customerName
              : activity.project.customerName ||
                (typeof activity.project.customerId === 'object' ? activity.project.customerId.name : undefined);
            const amount = isReservation ? activity.reservation.totalPrice || 0 : activity.project.price;
            const studioName = isReservation
              ? getStudioName(activity.reservation)
              : getProjectStudioName(activity.project);

            return (
              <div
                key={`${activity.kind}-${entity._id}`}
                className={`recent-activity__item ${index === recentActivities.length - 1 ? 'recent-activity__item--last' : ''}`}
                onClick={() => handleActivityClick(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleActivityClick(activity);
                  }
                }}
              >
                {index < recentActivities.length - 1 && <div className="recent-activity__timeline-line" />}

                <div className="recent-activity__status-indicator">
                  <div className={`recent-activity__status-dot ${getStatusClass(entity.status)}`} />
                </div>

                <div className="recent-activity__content">
                  <div className="recent-activity__content-header">
                    <h4 className="recent-activity__client-name">
                      {customerName || t('recentActivity.anonymousClient')}
                    </h4>
                    <span className="recent-activity__amount">₪{amount.toLocaleString()}</span>
                  </div>

                  {studioName && <span className="recent-activity__studio-name">{studioName}</span>}

                  <p className="recent-activity__description">
                    {isReservation
                      ? getActivityMessage(activity.reservation)
                      : t('recentActivity.project', { title: activity.project.title })}
                  </p>

                  <div className="recent-activity__meta">
                    <span className="recent-activity__meta-item">
                      <CalendarTodayIcon className="recent-activity__meta-icon" />
                      {isReservation ? formatDate(activity.reservation) : dayjs(activity.timestamp).fromNow()}
                    </span>
                    <span className="recent-activity__meta-item">
                      <ScheduleIcon className="recent-activity__meta-icon" />
                      {isReservation
                        ? formatDuration(activity.reservation)
                        : getProjectStatusLabel(activity.project.status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="recent-activity__view-actions">
          <button className="recent-activity__view-all" onClick={() => navigate('/reservations')}>
            {t('recentActivity.viewReservations')}
          </button>
          <button className="recent-activity__view-all" onClick={() => navigate(`/${i18n.language}/projects`)}>
            {t('recentActivity.viewProjects')}
          </button>
        </div>
      </div>
    </div>
  );
};
