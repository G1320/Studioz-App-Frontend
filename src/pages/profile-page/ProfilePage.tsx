import ProfileDetails from '@components/entities/profile/ProfileDetails';
import { User } from 'src/types/index';

interface ProfilePageProps {
  user: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <section className="profile-page">
      <ProfileDetails user={user} />
    </section>
  );
};
