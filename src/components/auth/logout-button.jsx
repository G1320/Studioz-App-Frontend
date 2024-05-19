import { useAuth0 } from '@auth0/auth0-react';

import React from 'react';
import Button from '../common/buttons/genericButton';
import { setLocalUser } from '../../services/user-service';

const logoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
  };
  return (
    isAuthenticated && (
      <Button onClick={handleLogout} className="button login button">
        Sign out
      </Button>
    )
  );
};

export default logoutButton;
