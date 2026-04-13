import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notification from '@appTypes/notification';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { useReservation } from '@shared/hooks';
import { usePopupDropdownClose } from '@shared/components/drop-downs/PopupDropdown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/he';
import {
  DeleteIcon,
  NotificationIcon,
  CheckCircleIcon,
  CancelIcon,
  ClockIcon,
  EditIcon,
  CampaignIcon,
  MoneyIcon,
  StarIcon,
  CreditCardIcon,
  SyncDisabledIcon,
  BarChartIcon,
  EmailIcon,
  ErrorIcon
} from '@shared/components/icons';
import '../styles/notification-item.scss';

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { t, i18n } = useTranslation('common');
  const { markAsRead, deleteNotificationById } = useNotificationContext();
  const { openReservationModal } = useReservationModal();
  const closeDropdown = usePopupDropdownClose();

  // Check if this is a reservation-related notification
  const isReservationNotification = useMemo(() => {
    return notification.type.startsWith('reservation_') || notification.type === 'new_reservation';
  }, [notification.type]);

  // Extract reservationId from notification data or actionUrl
  const reservationId = useMemo(() => {
    if (notification.data?.reservationId) {
      return notification.data.reservationId;
    }
    // Try to extract from actionUrl if it's a reservation URL
    if (notification.actionUrl?.includes('/reservations/')) {
      const match = notification.actionUrl.match(/\/reservations\/([^\/]+)/);
      return match ? match[1] : null;
    }
    return null;
  }, [notification.data?.reservationId, notification.actionUrl]);

  // Fetch reservation if we have a reservationId and it's a reservation notification
  const { data: reservation } = useReservation(reservationId || '');

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    // If it's a reservation notification and we have the reservation, open modal
    if (isReservationNotification && reservation) {
      openReservationModal(reservation);
    }

    // Close the notification dropdown
    closeDropdown();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent link navigation
    await deleteNotificationById(notification._id);
  };

  const getNotificationIcon = () => {
    const iconStyle = { fontSize: 24 };
    const glow = (color: string, rgb: string) => ({
      ...iconStyle,
      color,
      filter: `drop-shadow(0 0 8px rgba(${rgb},0.5))`
    });

    switch (notification.type) {
      // Bookings
      case 'new_reservation':
        return <NotificationIcon style={glow('#ffd166', '255,209,102')} />;
      case 'reservation_confirmed':
        return <CheckCircleIcon style={glow('#22c55e', '34,197,94')} />;
      case 'reservation_cancelled':
        return <CancelIcon style={glow('#ef4444', '239,68,68')} />;
      case 'reservation_expired':
        return <ClockIcon style={glow('#fb7185', '251,113,133')} />;
      case 'reservation_modified':
        return <EditIcon style={glow('#ffd166', '255,209,102')} />;
      case 'reservation_reminder':
        return <ClockIcon style={glow('#60a5fa', '96,165,250')} />;

      // Payments
      case 'payout_completed':
        return <MoneyIcon style={glow('#22c55e', '34,197,94')} />;
      case 'payout_failed':
        return <MoneyIcon style={glow('#ef4444', '239,68,68')} />;

      // Reviews
      case 'new_review':
        return <StarIcon style={glow('#fbbf24', '251,191,36')} />;

      // Billing
      case 'subscription_trial_ending':
        return <CreditCardIcon style={glow('#f59e0b', '245,158,11')} />;
      case 'subscription_payment_failed':
        return <CreditCardIcon style={glow('#ef4444', '239,68,68')} />;
      case 'subscription_renewed':
        return <CreditCardIcon style={glow('#22c55e', '34,197,94')} />;

      // System
      case 'calendar_sync_error':
        return <SyncDisabledIcon style={glow('#ef4444', '239,68,68')} />;
      case 'platform_announcement':
        return <CampaignIcon style={glow('#a78bfa', '167,139,250')} />;
      case 'weekly_summary':
        return <BarChartIcon style={glow('#60a5fa', '96,165,250')} />;

      // Activity
      case 'customer_message':
        return <EmailIcon style={glow('#60a5fa', '96,165,250')} />;
      case 'new_remote_project':
        return <NotificationIcon style={glow('#a78bfa', '167,139,250')} />;
      case 'availability_alert':
        return <NotificationIcon style={glow('#f59e0b', '245,158,11')} />;

      case 'system_alert':
        return <ErrorIcon style={glow('#f59e0b', '245,158,11')} />;

      default:
        return <CampaignIcon style={glow('#ffd166', '255,209,102')} />;
    }
  };

  const localizedTitle = t(`notifications.types.${notification.type}`, notification.title);

  const timeAgo = notification.createdAt ? dayjs(notification.createdAt).locale(i18n.language).fromNow() : '';

  const message = useMemo(() => {
    if (isReservationNotification && reservation) {
      const name =
        reservation.customerName || notification.data?.customerName || notification.title || notification.message;

      const item =
        i18n.language === 'he' && reservation.itemName?.he
          ? reservation.itemName.he
          : reservation.itemName?.en || notification.data?.itemName || '';

      const dateStr = reservation.bookingDate
        ? dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('DD/MM/YYYY')
        : notification.data?.bookingDate;

      const timeSlot = reservation.timeSlots?.[0];
      const timeStr = timeSlot ? dayjs(timeSlot, 'HH:mm').format('HH:mm') : notification.data?.time;

      return t('notifications.messages.reservationBooked', {
        name,
        item,
        date: dateStr,
        time: timeStr,
        defaultValue: notification.message
      });
    }

    if (notification.type === 'new_remote_project') {
      const d = notification.data;
      const customerName = d?.customerName || d?.name || '';
      const projectTitle = d?.projectTitle || d?.title || '';
      if (!customerName && !projectTitle && notification.message) {
        return notification.message;
      }
      return t('notifications.messages.newRemoteProject', {
        customerName:
          customerName ||
          t('notifications.fallbacks.remoteProjectCustomer', { defaultValue: 'A customer' }),
        projectTitle:
          projectTitle ||
          t('notifications.fallbacks.remoteProjectTitle', { defaultValue: 'Untitled project' }),
        defaultValue: notification.message
      });
    }

    return notification.message;
  }, [
    i18n.language,
    isReservationNotification,
    notification.data,
    notification.message,
    notification.title,
    notification.type,
    reservation,
    t
  ]);

  const content = (
    <div
      className={`notification-item ${notification.read ? 'notification-item--read' : 'notification-item--unread'}`}
      onClick={handleClick}
    >
      <div className="notification-item__icon">{getNotificationIcon()}</div>
      <div className="notification-item__content">
        <div className="notification-item__title">{localizedTitle}</div>
        <div className="notification-item__message">{message}</div>
        <div className="notification-item__time">{timeAgo}</div>
      </div>
      <button
        className="notification-item__delete"
        onClick={handleDelete}
        aria-label={t('notifications.deleteNotification', 'Delete notification')}
        title={t('notifications.deleteNotification', 'Delete notification')}
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  );

  // For reservation notifications, use click handler instead of Link
  if (isReservationNotification && reservation) {
    return (
      <div className="notification-item__link" onClick={handleClick} role="button" tabIndex={0}>
        {content}
      </div>
    );
  }

  // For other notifications with actionUrl, use Link
  if (notification.actionUrl) {
    return (
      <Link to={notification.actionUrl} className="notification-item__link" onClick={closeDropdown}>
        {content}
      </Link>
    );
  }

  return content;
};
