import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Notification from 'src/types/notification';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { useReservation } from '@shared/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/notification-item.scss';

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
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
    switch (notification.type) {
      case 'new_reservation':
        return '🔔';
      case 'reservation_confirmed':
        return '✅';
      case 'reservation_cancelled':
        return '❌';
      case 'reservation_expired':
        return '⏰';
      case 'reservation_modified':
        return '✏️';
      default:
        return '📢';
    }
  };

  const timeAgo = notification.createdAt ? dayjs(notification.createdAt).fromNow() : '';

  const content = (
    <div
      className={`notification-item ${notification.read ? 'notification-item--read' : 'notification-item--unread'}`}
      onClick={handleClick}
    >
      <div className="notification-item__icon">{getNotificationIcon()}</div>
      <div className="notification-item__content">
        <div className="notification-item__title">{notification.title}</div>
        <div className="notification-item__message">{notification.message}</div>
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
