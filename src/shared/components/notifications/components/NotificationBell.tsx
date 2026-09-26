import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationsNoneIcon } from '@shared/components/icons';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { NotificationList } from './NotificationList';
import { PopupDropdown } from '@shared/components/drop-downs';
import '../styles/notification-bell.scss';

export const NotificationBell: React.FC = () => {
  const { t } = useTranslation('common');
  const { unreadCount } = useNotificationContext();

  // Always anchor to bottom-right - the RTL CSS will automatically flip it correctly
  // In LTR: anchors to bottom-right, opens left
  // In RTL: CSS flips it to anchor to bottom-left (visually right), opens right
  return (
    <>
      {/* Screen reader announcement for notification count changes */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {unreadCount > 0 &&
          t('a11y.unreadAnnouncement', {
            count: unreadCount,
            defaultValue: `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
          })}
      </div>
      <PopupDropdown
        trigger={
          <button
            className="notification-bell__button header-icon-button"
            aria-label={
              unreadCount > 0
                ? t('a11y.notificationsUnread', { count: unreadCount })
                : t('a11y.notifications')
            }
          >
            <NotificationsNoneIcon className="notification-bell__icon" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className={`notification-bell__badge ${unreadCount < 10 ? 'notification-bell__badge--single' : ''}`}
                aria-hidden="true"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        }
        className="notification-bell"
        anchor="bottom-right"
        minWidth="320px"
        maxWidth="420px"
        lockScroll
      >
        <NotificationList />
      </PopupDropdown>
    </>
  );
};
