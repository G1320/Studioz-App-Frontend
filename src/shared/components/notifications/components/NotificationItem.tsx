import React from 'react';
import { Link } from 'react-router-dom';
import Notification from 'src/types/notification';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/_notification-item.scss';

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, deleteNotificationById } = useNotificationContext();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  if (notification.actionUrl) {
    return (
      <Link to={notification.actionUrl} className="notification-item__link">
        {content}
      </Link>
    );
  }

  return content;
};

