import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { LogoutIcon } from '@shared/components/icons';
import { clearGuestBookingFormStorage } from '@shared/utils/reservation-storage';
import { useUserContext } from '@core/contexts';
import { resetAuth0LoginSyncState } from '@shared/hooks/auth/useAuth0LoginHandler';

interface LogoutButtonProps {
  className?: string;
  'aria-label'?: string;
}

/**
 * Clear app session before Auth0 redirect. Without setUser(null), React keeps the
 * logged-in user in memory — dashboard stays authenticated and booking forms re-prefill.
 */
function clearAppSession(setUser: (user: null) => void): void {
  clearGuestBookingFormStorage();
  localStorage.removeItem('user');
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  resetAuth0LoginSyncState();
  setUser(null);
}

export const LogoutButton = ({ className = '', 'aria-label': ariaLabel }: LogoutButtonProps) => {
  const { logout } = useAuth0();
  const { setUser } = useUserContext();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    clearAppSession(setUser);
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <button onClick={handleLogout} type="button" className={className} aria-label={ariaLabel}>
      <LogoutIcon className="profile-action-icon" />
      <span>{t('buttons.log_out')}</span>
    </button>
  );
};
