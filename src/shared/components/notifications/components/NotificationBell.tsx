import React from 'react';
import { useTranslation } from 'react-i18next';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { NotificationList } from './NotificationList';
import { PopupDropdown } from '@shared/components/drop-downs';
import '../styles/notification-bell.scss';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotificationContext();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // In LTR: anchor to bottom-right (opens left)
  // In RTL: anchor to bottom-left (opens right, which is visually on the right side)
  const anchor = isRTL ? 'bottom-left' : 'bottom-right';

  return (
    <PopupDropdown
      trigger={
        <button
          className="notification-bell__button"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <NotificationsIcon className="notification-bell__icon" />
          {unreadCount > 0 && (
            <span className="notification-bell__badge" aria-label={`${unreadCount} unread notifications`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      }
      className="notification-bell"
      anchor={anchor}
      minWidth="320px"
      maxWidth="420px"
    >
      <NotificationList />
    </PopupDropdown>
  );
};
