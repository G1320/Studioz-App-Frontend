import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';
import './NotificationList.scss';

export const NotificationList: React.FC = () => {
  const { notifications, markAllAsRead, isLoading } = useNotificationContext();
  const { t } = useTranslation('common');

  if (isLoading) {
    return (
      <div className="notification-list">
        <div className="notification-list__loading">{t('notifications.loading', 'Loading notifications...')}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-list">
        <div className="notification-list__empty">{t('notifications.empty', 'No notifications')}</div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-list">
      <div className="notification-list__header">
        <h3 className="notification-list__title">{t('notifications.title', 'Notifications')}</h3>
        {unreadCount > 0 && (
          <button
            className="notification-list__mark-all-read"
            onClick={markAllAsRead}
            aria-label={t('notifications.markAllAsRead', 'Mark all as read')}
          >
            {t('notifications.markAllAsRead', 'Mark all as read')}
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

