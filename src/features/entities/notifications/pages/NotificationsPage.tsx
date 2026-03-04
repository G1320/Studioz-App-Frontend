import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserContext } from '@core/contexts/UserContext';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { getNotifications } from '@shared/services/notification-service';
import Notification, { NotificationCategory, NOTIFICATION_CATEGORIES } from '@appTypes/notification';
import { NotificationItem } from '@shared/components/notifications/components/NotificationItem';
import '../styles/notifications-page.scss';

const ITEMS_PER_PAGE = 15;

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useUserContext();
  const { markAllAsRead, deleteAllRead } = useNotificationContext();
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>('all');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['notifications-page', user?._id, activeCategory],
    queryFn: ({ pageParam }) =>
      getNotifications({
        category: activeCategory === 'all' ? undefined : activeCategory,
        limit: ITEMS_PER_PAGE,
        cursor: pageParam as string | undefined
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt;
    },
    enabled: !!user?._id
  });

  const notifications = data?.pages.flat() ?? [];

  // Intersection observer for infinite scroll
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-page__container">
        {/* Header */}
        <header className="notifications-page__header">
          <div className="notifications-page__header-left">
            <h1 className="notifications-page__title">{t('notifications.page.title', 'Notifications')}</h1>
            {unreadCount > 0 && <span className="notifications-page__badge">{unreadCount}</span>}
          </div>
          <div className="notifications-page__header-actions">
            {unreadCount > 0 && (
              <button className="notifications-page__action-btn" onClick={markAllAsRead}>
                {t('notifications.markAllRead', 'Mark all as read')}
              </button>
            )}
            {readCount > 0 && (
              <button
                className="notifications-page__action-btn notifications-page__action-btn--danger"
                onClick={deleteAllRead}
              >
                {t('notifications.deleteRead', 'Clear read')}
              </button>
            )}
          </div>
        </header>

        {/* Category filters */}
        <div className="notifications-page__filters">
          <button
            className={`notifications-page__filter ${activeCategory === 'all' ? 'notifications-page__filter--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            {t('notifications.categories.all', 'All')}
          </button>
          {NOTIFICATION_CATEGORIES.map(({ key }) => (
            <button
              key={key}
              className={`notifications-page__filter ${activeCategory === key ? 'notifications-page__filter--active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {t(`notifications.categories.${key}`, key)}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="notifications-page__list">
          {isLoading ? (
            <div className="notifications-page__empty">{t('common.loading', 'Loading...')}</div>
          ) : notifications.length === 0 ? (
            <div className="notifications-page__empty">
              <span className="notifications-page__empty-icon">🔔</span>
              <p>{t('notifications.page.empty', 'No notifications yet')}</p>
              {activeCategory !== 'all' && (
                <p className="notifications-page__empty-hint">
                  {t('notifications.page.emptyFilter', 'Try selecting a different category')}
                </p>
              )}
            </div>
          ) : (
            <>
              {notifications.map((notification: Notification, index: number) => (
                <div
                  key={notification._id}
                  ref={index === notifications.length - 1 ? lastItemRef : undefined}
                  className={`notifications-page__item ${notification.priority === 'high' ? 'notifications-page__item--high' : ''}`}
                >
                  <NotificationItem notification={notification} />
                </div>
              ))}
              {isFetchingNextPage && (
                <div className="notifications-page__loading-more">{t('common.loading', 'Loading...')}</div>
              )}
              <div ref={loadMoreRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
