import ProfileDetails from '@components/entities/profile/ProfileDetails';
import { useSearchParams } from 'react-router-dom';
import { User } from 'src/types/index';

interface ProfilePageProps {
  user: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const onboardingStatus = searchParams.get('onboarding') || user?.paypalOnboardingStatus;

  return (
    <section className="profile-page">
      <ProfileDetails user={user} onboardingStatus={onboardingStatus || ''} />
    </section>
  );
};
