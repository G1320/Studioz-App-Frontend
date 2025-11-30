import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    localStorage.removeItem('user');
  };

  return (
    <button onClick={handleLogout} type="button">
      {t('buttons.log_out')}
    </button>
  );
};
