import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useUserContext } from '@core/contexts/UserContext';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { getNotifications } from '@shared/services/notification-service';
import Notification, {
  NotificationCategory,
  NotificationType,
  NOTIFICATION_CATEGORIES
} from '@appTypes/notification';
import { NotificationItem } from '@shared/components/notifications/components/NotificationItem';
import { PageHeader } from '@shared/components';
import { NotificationsIcon } from '@shared/components/icons';
import '../styles/notifications-page.scss';

const ITEMS_PER_PAGE = 20;

type NotificationFilter =
  | 'all'
  | NotificationCategory
  | 'project_chat'
  | 'track_comments'
  | 'comment_replies';

const PROJECT_MESSAGE_FILTERS: Array<{
  key: Exclude<NotificationFilter, 'all' | NotificationCategory>;
  types: NotificationType[];
}> = [
  { key: 'project_chat', types: ['project_chat_message'] },
  { key: 'track_comments', types: ['project_track_comment'] },
  { key: 'comment_replies', types: ['project_comment_reply'] }
];

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useUserContext();
  const { markAllAsRead, deleteAllRead } = useNotificationContext();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const requestFilter = useMemo(() => {
    const projectFilter = PROJECT_MESSAGE_FILTERS.find(({ key }) => key === activeFilter);
    if (projectFilter) return { types: projectFilter.types };
    if (activeFilter !== 'all') return { category: activeFilter as NotificationCategory };
    return {};
  }, [activeFilter]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['notifications-page', user?._id, activeFilter],
    queryFn: ({ pageParam }) =>
      getNotifications({
        ...requestFilter,
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

  const notifications = useMemo(() => data?.pages.flat() ?? [], [data]);

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
    return () => observerRef.current?.disconnect();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-page__container">
        <PageHeader
          icon={<NotificationsIcon />}
          title={t('notifications.page.title', 'Notifications')}
          meta={
            unreadCount > 0 ? (
              <span className="notifications-page__badge">{unreadCount}</span>
            ) : null
          }
        >
          {unreadCount > 0 ? (
            <button type="button" className="page-header__ghost-btn" onClick={markAllAsRead}>
              {t('notifications.markAllRead', 'Mark all as read')}
            </button>
          ) : null}
          {readCount > 0 ? (
            <button
              type="button"
              className="page-header__ghost-btn page-header__ghost-btn--danger"
              onClick={deleteAllRead}
            >
              {t('notifications.deleteRead', 'Clear read')}
            </button>
          ) : null}
        </PageHeader>

        <div className="notifications-page__filters">
          <button
            className={`notifications-page__filter ${activeFilter === 'all' ? 'notifications-page__filter--active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            {t('notifications.categories.all', 'All')}
          </button>
          {NOTIFICATION_CATEGORIES.map(({ key }) => (
            <button
              key={key}
              className={`notifications-page__filter ${activeFilter === key ? 'notifications-page__filter--active' : ''}`}
              onClick={() => setActiveFilter(key)}
            >
              {t(`notifications.categories.${key}`, key)}
            </button>
          ))}
          {PROJECT_MESSAGE_FILTERS.map(({ key }) => (
            <button
              key={key}
              className={`notifications-page__filter ${activeFilter === key ? 'notifications-page__filter--active' : ''}`}
              onClick={() => setActiveFilter(key)}
            >
              {t(`notifications.filters.${key}`, key)}
            </button>
          ))}
        </div>

        <div className="notifications-page__list">
          {isLoading ? (
            <div className="notifications-page__empty">{t('common.loading', 'Loading...')}</div>
          ) : notifications.length === 0 ? (
            <div className="notifications-page__empty">
              <span className="notifications-page__empty-icon">🔔</span>
              <p>{t('notifications.page.empty', 'No notifications yet')}</p>
              {activeFilter !== 'all' && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
