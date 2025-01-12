import { useLanguageNavigate } from '@hooks/utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('profile');

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
          <p>{t('profile.sellerAccount.status.error')}</p>
        </div>
      );
    }

    if (onboardingStatus === 'PENDING') {
      return (
        <div className="onboarding-status pending">
          <p>{t('profile.sellerAccount.status.pending')}</p>
        </div>
      );
    }

    if (onboardingStatus === 'COMPLETED') {
      return (
        <div className="onboarding-status success">
          <p>{t('profile.sellerAccount.status.success')}</p>
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
          <h1 className="profile-name">{user?.name || t('profile.guestUser')}</h1>
          <p className="profile-email">{user?.email || t('profile.email.notAvailable')}</p>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-section">
          <div className="seller-onboarding">
            <h2>{t('profile.sellerAccount.title')}</h2>
            {user?.paypalOnboardingStatus !== 'COMPLETED' && (
              <p className="section-description">{t('profile.sellerAccount.description')}</p>
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
                {onboardingStatus === 'COMPLETED'
                  ? t('profile.sellerAccount.buttons.connected')
                  : t('profile.sellerAccount.buttons.connect')}
              </button>
              {onboardingStatus === 'COMPLETED' && (
                <button onClick={() => langNavigate('/create-studio')}>
                  {t('profile.sellerAccount.buttons.createStudio')}
                </button>
              )}
              {/* {user?.studios && user.studios.length > 0 && ( */}
              <button onClick={() => langNavigate('/calendar')}>{t('profile.sellerAccount.buttons.calendar')}</button>
              {/* )} */}
            </div>
          </div>
        </div>

        <div className="profile-section legal-links">
          <h2>{t('profile.legal.title')}</h2>
          <div className="legal-buttons">
            <button className="link-button" onClick={() => handleNavigate('/privacy')}>
              {t('profile.legal.privacy')}
            </button>
            <button className="link-button" onClick={() => handleNavigate('/terms')}>
              {t('profile.legal.terms')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
