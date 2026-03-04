import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { usePopupDropdownClose } from '@shared/components/drop-downs/PopupDropdown';
import { NotificationItem } from './NotificationItem';
import '../styles/notification-list.scss';

export const NotificationList: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    deleteAllRead,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useNotificationContext();
  const { t, i18n } = useTranslation('common');
  const closeDropdown = usePopupDropdownClose();

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasNextPage || isFetchingNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 80) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

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

  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="notification-list">
      <div className="notification-list__header">
        <h3 className="notification-list__title">{t('notifications.title', 'Notifications')}</h3>
        <div className="notification-list__actions">
          {unreadCount > 0 && (
            <button
              className="notification-list__mark-all-read"
              onClick={markAllAsRead}
              aria-label={t('notifications.markAllAsRead', 'Mark all as read')}
            >
              {t('notifications.markAllAsRead', 'Mark all as read')}
            </button>
          )}
          {readCount > 0 && (
            <button
              className="notification-list__delete-read"
              onClick={deleteAllRead}
              aria-label={t('notifications.deleteAllRead', 'Clear read')}
            >
              {t('notifications.deleteAllRead', 'Clear read')}
            </button>
          )}
        </div>
      </div>
      <div className="notification-list__items" onScroll={handleScroll}>
        {notifications.map((notification) => (
          <NotificationItem key={notification._id} notification={notification} />
        ))}
        {isFetchingNextPage && <div className="notification-list__loading-more" />}
      </div>
      <Link
        to={`${i18n.language !== 'en' ? `/${i18n.language}` : ''}/notifications`}
        className="notification-list__see-all"
        onClick={closeDropdown}
      >
        {t('notifications.seeAll', 'See all notifications')}
      </Link>
    </div>
  );
};
