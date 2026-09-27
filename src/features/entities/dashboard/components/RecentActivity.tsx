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
  const { data: reservations = [], isLoading: reservationsLoading, error: reservationsError } = useReservations();
  const {
    projects,
    isLoading: projectsLoading,
    isError: projectsError
  } = useRemoteProjects({
    mine: Boolean(user?._id),
    enabled: Boolean(user?._id),
    limit: Math.max(limit * 4, 20)
  });
  const { openReservationModal } = useReservationModal();

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
    const hours = reservation.timeSlots?.length || reservation.quantity || 1;
    return `${hours}${t('recentActivity.hours')}`;
  };

  const getStudioName = (reservation: Reservation) => {
    if (i18n.language === 'he' && reservation.studioName?.he) return reservation.studioName.he;
    return reservation.studioName?.en || '';
  };

  const getActivityDetail = (reservation: Reservation) => {
    const itemName =
      i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';
    return itemName;
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

  const getReservationStatusLabel = (status: string) => {
    const normalized = (status || 'pending').toLowerCase();
    return t(`recentActivity.reservationStatus.${normalized}`, {
      defaultValue: normalized.replace(/_/g, ' ')
    });
  };

  const handleActivityClick = (activity: RecentActivityItem) => {
    if (activity.kind === 'reservation') {
      openReservationModal(activity.reservation);
      return;
    }
    navigate(`/${i18n.language}/projects/${activity.project._id}`);
  };

  if ((reservationsLoading || projectsLoading) && !reservationsError && !projectsError) {
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
        <div className="recent-activity__table" role="table" aria-label={t('recentActivity.title')}>
          <div className="recent-activity__head" role="row">
            <span className="recent-activity__col recent-activity__col--client" role="columnheader">
              {t('recentActivity.columns.client')}
            </span>
            <span className="recent-activity__col recent-activity__col--detail" role="columnheader">
              {t('recentActivity.columns.detail')}
            </span>
            <span className="recent-activity__col recent-activity__col--when" role="columnheader">
              {t('recentActivity.columns.when')}
            </span>
            <span className="recent-activity__col recent-activity__col--status" role="columnheader">
              {t('recentActivity.columns.status')}
            </span>
            <span className="recent-activity__col recent-activity__col--amount" role="columnheader">
              {t('recentActivity.columns.amount')}
            </span>
          </div>

          <div className="recent-activity__list" role="rowgroup">
            {recentActivities.map((activity) => {
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
              const detail = isReservation
                ? getActivityDetail(activity.reservation)
                : activity.project.title;
              const when = isReservation
                ? formatDate(activity.reservation)
                : dayjs(activity.timestamp).fromNow();
              const statusLabel = isReservation
                ? `${getReservationStatusLabel(activity.reservation.status)}${
                    activity.reservation.timeSlots?.length ? ` · ${formatDuration(activity.reservation)}` : ''
                  }`
                : getProjectStatusLabel(activity.project.status);

              return (
                <div
                  key={`${activity.kind}-${entity._id}`}
                  className="recent-activity__item"
                  onClick={() => handleActivityClick(activity)}
                  role="row"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleActivityClick(activity);
                    }
                  }}
                >
                  <div className="recent-activity__col recent-activity__col--client" role="cell">
                    <span className={`recent-activity__status-dot ${getStatusClass(entity.status)}`} aria-hidden />
                    <div className="recent-activity__client-block">
                      <span className="recent-activity__client-name">
                        {customerName || t('recentActivity.anonymousClient')}
                      </span>
                      <span
                        className={`recent-activity__type recent-activity__type--${activity.kind === 'reservation' ? 'booking' : 'project'}`}
                      >
                        {isReservation ? t('recentActivity.type.booking') : t('recentActivity.type.project')}
                      </span>
                    </div>
                  </div>

                  <div className="recent-activity__col recent-activity__col--detail" role="cell">
                    <span className="recent-activity__detail">{detail || '—'}</span>
                    {studioName && <span className="recent-activity__studio">{studioName}</span>}
                  </div>

                  <div className="recent-activity__col recent-activity__col--when" role="cell">
                    <span className="recent-activity__when">{when}</span>
                  </div>

                  <div className="recent-activity__col recent-activity__col--status" role="cell">
                    <span className={`recent-activity__status-label ${getStatusClass(entity.status)}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="recent-activity__col recent-activity__col--amount" role="cell">
                    <span className="recent-activity__amount">₪{amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="recent-activity__view-actions">
          <button type="button" className="recent-activity__view-all" onClick={() => navigate('/reservations')}>
            {t('recentActivity.viewReservations')}
          </button>
          <button
            type="button"
            className="recent-activity__view-all"
            onClick={() => navigate(`/${i18n.language}/projects`)}
          >
            {t('recentActivity.viewProjects')}
          </button>
        </div>
      </div>
    </div>
  );
};
