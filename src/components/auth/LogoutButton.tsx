import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@components/common/buttons';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    localStorage.removeItem('user');
  };

  return (
    <Button onClick={handleLogout} className="button login button">
      Sign out
    </Button>
  );
};
