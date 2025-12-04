import React from 'react';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';
import './NotificationList.scss';

export const NotificationList: React.FC = () => {
  const { notifications, markAllAsRead, isLoading } = useNotificationContext();

  if (isLoading) {
    return (
      <div className="notification-list">
        <div className="notification-list__loading">Loading notifications...</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-list">
        <div className="notification-list__empty">No notifications</div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-list">
      <div className="notification-list__header">
        <h3 className="notification-list__title">Notifications</h3>
        {unreadCount > 0 && (
          <button
            className="notification-list__mark-all-read"
            onClick={markAllAsRead}
            aria-label="Mark all as read"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="notification-list__items">
        {notifications.map((notification) => (
          <NotificationItem key={notification._id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

