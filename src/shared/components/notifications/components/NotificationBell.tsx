import React, { useState, useRef, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationContext } from '@core/contexts/NotificationContext';
import { NotificationList } from './NotificationList';
import '../styles/notification-bell.scss';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="notification-bell__button"
        onClick={toggleDropdown}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <NotificationsIcon className="notification-bell__icon" />
        {unreadCount > 0 && (
          <span className="notification-bell__badge" aria-label={`${unreadCount} unread notifications`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="notification-bell__dropdown">
          <NotificationList />
        </div>
      )}
    </div>
  );
};

