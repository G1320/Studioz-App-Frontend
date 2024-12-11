import { useAuth0 } from '@auth0/auth0-react';
import { User } from 'src/types/index';

interface ProfilePageProps {
  user: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <p>You need to log in to view your profile.</p>;
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <img src={user?.picture} alt={`${user?.name}'s avatar`} className="profile-avatar" />
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-body">
        <h2>About Me</h2>

        <h2>Account Details</h2>
        <ul>
          <li>
            <strong>Email:</strong> {user?.email || 'N/A'}
          </li>
        </ul>
      </div>
    </section>
  );
};
