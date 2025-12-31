import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notification from 'src/types/notification';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { useReservation } from '@shared/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import CampaignIcon from '@mui/icons-material/Campaign';
import '../styles/notification-item.scss';

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { t, i18n } = useTranslation('common');
  const { markAsRead, deleteNotificationById } = useNotificationContext();
  const { openReservationModal } = useReservationModal();

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
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent link navigation
    await deleteNotificationById(notification._id);
  };

  const getNotificationIcon = () => {
    const iconStyle = { fontSize: 24 };
    
    switch (notification.type) {
      case 'new_reservation':
        return (
          <NotificationsIcon 
            style={{ ...iconStyle, color: '#ffd166', filter: 'drop-shadow(0 0 8px rgba(255,209,102,0.5))' }} 
          />
        );
      case 'reservation_confirmed':
        return (
          <CheckCircleIcon 
            style={{ ...iconStyle, color: '#22c55e', filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))' }} 
          />
        );
      case 'reservation_cancelled':
        return (
          <CancelIcon 
            style={{ ...iconStyle, color: '#ef4444', filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' }} 
          />
        );
      case 'reservation_expired':
        return (
          <AccessTimeIcon 
            style={{ ...iconStyle, color: '#fb7185', filter: 'drop-shadow(0 0 8px rgba(251,113,133,0.5))' }} 
          />
        );
      case 'reservation_modified':
        return (
          <EditIcon 
            style={{ ...iconStyle, color: '#ffd166', filter: 'drop-shadow(0 0 8px rgba(255,209,102,0.5))' }} 
          />
        );
      default:
        return (
          <CampaignIcon 
            style={{ ...iconStyle, color: '#ffd166', filter: 'drop-shadow(0 0 8px rgba(255,209,102,0.5))' }} 
          />
        );
    }
  };

  const timeAgo = notification.createdAt ? dayjs(notification.createdAt).fromNow() : '';

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

    return notification.message;
  }, [
    i18n.language,
    isReservationNotification,
    notification.data,
    notification.message,
    notification.title,
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
        <div className="notification-item__title">{notification.title}</div>
        <div className="notification-item__message">{message}</div>
        <div className="notification-item__time">{timeAgo}</div>
      </div>
      <button
        className="notification-item__delete"
        onClick={handleDelete}
        aria-label="Delete notification"
        title="Delete notification"
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
      <Link to={notification.actionUrl} className="notification-item__link">
        {content}
      </Link>
    );
  }

  return content;
};
