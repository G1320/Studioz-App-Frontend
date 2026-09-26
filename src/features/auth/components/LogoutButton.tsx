import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { LogoutIcon } from '@shared/components/icons';
import { clearGuestBookingFormStorage } from '@shared/utils/reservation-storage';

interface LogoutButtonProps {
  className?: string;
  'aria-label'?: string;
}

export const LogoutButton = ({ className = '', 'aria-label': ariaLabel }: LogoutButtonProps) => {
  const { logout } = useAuth0();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    clearGuestBookingFormStorage();
    localStorage.removeItem('user');
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
