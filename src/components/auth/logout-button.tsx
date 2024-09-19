import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components'

export const LogoutButton = () => {
  const { user, logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
  };

  return (
    user && isAuthenticated ? (
      <Button onClick={handleLogout} className="button login button">
        Sign out
      </Button>
    ) : null
  );
};

export default LogoutButton;
