import { useAuth0 } from '@auth0/auth0-react';

import React from 'react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  return isAuthenticated && <article>{/* <strong> {user.name}</strong>{' '} */}</article>;
};

export default Profile;
