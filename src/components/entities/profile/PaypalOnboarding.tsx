import { useLanguageNavigate } from '@hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://studioz-backend.onrender.com/api'
    : 'http://localhost:3003/api';

interface PayPalOnboardingProps {
  user: User | null;
  onboardingStatus?: string;
}

export const PayPalOnboarding: React.FC<PayPalOnboardingProps> = ({ user, onboardingStatus }) => {
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

  return (
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
        <button onClick={() => langNavigate('/calendar')}>{t('profile.sellerAccount.buttons.calendar')}</button>
      </div>
    </div>
  );
};

export default PayPalOnboarding;
