import { useAuth0 } from '@auth0/auth0-react';

export const Profile = () => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated && <article>{/* <strong> {user.name}</strong>{' '} */}</article>;
};
