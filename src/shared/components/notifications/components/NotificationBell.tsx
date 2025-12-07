import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { NotificationList } from './NotificationList';
import { PopupDropdown } from '@shared/components/drop-downs';
import '../styles/notification-bell.scss';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotificationContext();

  // Always anchor to bottom-right - the RTL CSS will automatically flip it correctly
  // In LTR: anchors to bottom-right, opens left
  // In RTL: CSS flips it to anchor to bottom-left (visually right), opens right
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
      anchor="bottom-right"
      minWidth="320px"
      maxWidth="420px"
    >
      <NotificationList />
    </PopupDropdown>
  );
};
