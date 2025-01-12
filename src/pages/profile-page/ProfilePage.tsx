import { useAuth0 } from '@auth0/auth0-react';
import ProfileDetails from '@components/entities/profile/ProfileDetails';
import { useSearchParams } from 'react-router-dom';
import { User } from 'src/types/index';

interface ProfilePageProps {
  user: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const { isAuthenticated } = useAuth0();
  const [searchParams] = useSearchParams();
  const onboardingStatus = searchParams.get('onboarding') || user?.paypalOnboardingStatus;

  if (!isAuthenticated) {
    return <p>You need to log in to view your profile.</p>;
  }

  return (
    <section className="profile-page">
      <ProfileDetails user={user} onboardingStatus={onboardingStatus || ''} />
    </section>
  );
};
