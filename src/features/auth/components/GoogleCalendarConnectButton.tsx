import { useGoogleCalendar } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';

interface GoogleCalendarConnectButtonProps {
  className?: string;
  variant?: 'button' | 'menu-item';
}

export const GoogleCalendarConnectButton: React.FC<GoogleCalendarConnectButtonProps> = ({
  className = '',
  variant = 'button'
}) => {
  const { isConnected, isLoading, error, connect, disconnect, refreshStatus } = useGoogleCalendar();
  const { t } = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();

  // Always render the button, even if there's an error
  if (error && !isLoading) {
    console.warn('Google Calendar hook error:', error);
  }

  // Check if we just connected (from OAuth callback redirect)
  useEffect(() => {
    const calendarParam = searchParams.get('calendar');
    if (calendarParam === 'connected') {
      // Refresh status to show connected state
      refreshStatus();
      // Remove the query parameter
      searchParams.delete('calendar');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshStatus]);

  const handleClick = async () => {
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (err) {
      console.error('Error toggling Google Calendar connection:', err);
    }
  };

  if (variant === 'menu-item') {
    return (
      <button
        className={`menu-dropdown__item ${className}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isConnected ? 'Disconnect Google Calendar' : 'Connect Google Calendar'}
      >
        {isConnected ? (
          <CheckCircleIcon className="menu-dropdown__icon" style={{ color: '#4caf50' }} />
        ) : (
          <SyncIcon className="menu-dropdown__icon" />
        )}
        <span>
          {isLoading
            ? t('buttons.loading', { defaultValue: 'Loading...' })
            : isConnected
              ? t('buttons.disconnectGoogleCalendar', { defaultValue: 'Disconnect Google Calendar' })
              : t('buttons.connectGoogleCalendar', { defaultValue: 'Connect Google Calendar' })}
        </span>
      </button>
    );
  }

  return (
    <div
      role="button"
      onClick={handleClick}
      className={`button google-calendar-button ${isConnected ? 'google-calendar-button--connected' : ''} ${className}`}
      aria-label={isConnected ? 'Disconnect Google Calendar' : 'Connect Google Calendar'}
    >
      {isLoading ? (
        <span>{t('buttons.loading', { defaultValue: 'Loading...' })}</span>
      ) : isConnected ? (
        <>
          <CheckCircleIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
          <span>{t('buttons.disconnectGoogleCalendar', { defaultValue: 'Disconnect Google Calendar' })}</span>
        </>
      ) : (
        <>
          <SyncDisabledIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
          <span>{t('buttons.connectGoogleCalendar', { defaultValue: 'Connect Google Calendar' })}</span>
        </>
      )}
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};
