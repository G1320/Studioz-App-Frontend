import { useLanguageNavigate } from '@hooks/utils';

import User from 'src/types/user';

interface ProfileDetailsProps {
  user: User | null;
  onboardingStatus?: string;
}

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://studioz-backend.onrender.com/api'
    : 'http://localhost:3003/api';

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, onboardingStatus }) => {
  const langNavigate = useLanguageNavigate();

  const handleOnboardClick = async () => {
    try {
      const response = await fetch(`${BASE_URL}/PPOnboarding/seller/generate-signup-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          sellerId: user?._id,
          returnUrl: `${window.location.origin}/api/PPOnboarding/onboarding/return`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate signup link');
      }

      const { signupLink } = await response.json();

      window.open(signupLink, '_blank');
    } catch (error) {
      console.error('Failed to start onboarding:', error);
    }
  };

  const getOnboardingStatusMessage = () => {
    if (!onboardingStatus) return null;

    if (onboardingStatus === 'FAILED' || onboardingStatus === 'status-check-failed') {
      return (
        <div className="onboarding-status error">
          <p>There was an issue connecting your PayPal account. Please try again or contact support.</p>
        </div>
      );
    }

    if (onboardingStatus === 'PENDING') {
      return (
        <div className="onboarding-status pending">
          <p>Your PayPal account connection is pending. Please complete the onboarding process.</p>
        </div>
      );
    }

    if (onboardingStatus === 'COMPLETED') {
      return (
        <div className="onboarding-status success">
          <p>Your PayPal account is successfully connected. </p>
        </div>
      );
    }

    return null;
  };

  const handleNavigate = (path: string) => {
    langNavigate(path);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-container"></div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name || 'Guest User'}</h1>
          <p className="profile-email">{user?.email || 'Email: N/A'}</p>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-section">
          <div className="seller-onboarding">
            <h2>Seller Account</h2>
            {user?.paypalOnboardingStatus !== 'COMPLETED' && (
              <p className="section-description">Connect your PayPal account to start selling</p>
            )}
            {getOnboardingStatusMessage()}
            <div className="seller-buttons">
              <button
                onClick={handleOnboardClick}
                className={`onboard-button ${
                  (onboardingStatus && onboardingStatus === 'success') || user?.paypalOnboardingStatus === 'COMPLETED'
                    ? 'onboarding-success'
                    : 'onboarding-error'
                }`}
              >
                {onboardingStatus === 'COMPLETED' ? 'PayPal Account Connected' : 'Connect PayPal Account'}
              </button>
              {(user?.studios?.length || 0) > 0 && (
                <button onClick={() => langNavigate('/calendar')}>My Calendar</button>
              )}
              {onboardingStatus === 'COMPLETED' && (
                <button onClick={() => langNavigate('/create-studio')}>List your studio</button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section legal-links">
          <h2>Legal Information</h2>
          <div className="legal-buttons">
            <button className="link-button" onClick={() => handleNavigate('/privacy')}>
              Privacy Policy
            </button>
            <button className="link-button" onClick={() => handleNavigate('/terms')}>
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
