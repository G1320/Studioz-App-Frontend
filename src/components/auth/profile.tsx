import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const {  isAuthenticated } = useAuth0();
  return isAuthenticated && <article>{/* <strong> {user.name}</strong>{' '} */}</article>;
};

export default Profile;
