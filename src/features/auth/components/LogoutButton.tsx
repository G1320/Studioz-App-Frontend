import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { LogoutIcon } from '@shared/components/icons';
import { logout as logoutAppSession } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { resetAuth0LoginSyncState } from '@shared/hooks/auth/useAuth0LoginHandler';

interface LogoutButtonProps {
  className?: string;
  'aria-label'?: string;
}

export const LogoutButton = ({ className = '', 'aria-label': ariaLabel }: LogoutButtonProps) => {
  const { logout } = useAuth0();
  const { setUser } = useUserContext();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  const handleLogout = async () => {
    // The API session cookies are httpOnly, so only the server can clear them.
    await logoutAppSession();
    resetAuth0LoginSyncState();
    setUser(null);
    queryClient.clear();
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <button onClick={() => void handleLogout()} type="button" className={className} aria-label={ariaLabel}>
      <LogoutIcon className="profile-action-icon" />
      <span>{t('buttons.log_out')}</span>
    </button>
  );
};
