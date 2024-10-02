import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components'

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
  };

  return (
      <Button onClick={handleLogout} className="button login button">
        Sign out
      </Button>
  );
};

export default LogoutButton;
