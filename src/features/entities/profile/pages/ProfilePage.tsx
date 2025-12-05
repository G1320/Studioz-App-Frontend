import { ProfileDetails } from '@features/entities/profile/components/ProfileDetails';
import { User } from 'src/types/index';

interface ProfilePageProps {
  user: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <section className="profile-page">
      <ProfileDetails user={user} />
    </section>
  );
};

export default ProfilePage;
