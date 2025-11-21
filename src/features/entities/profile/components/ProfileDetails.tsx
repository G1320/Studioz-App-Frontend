import { useLanguageNavigate } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';

interface ProfileDetailsProps {
  user: User | null;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('profile');

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
          <div className="profile-actions">
            {user && (
              <button onClick={() => handleNavigate('/dashboard')}>
                {t('profile.buttons.dashboard')}
              </button>
            )}
            {user?.subscriptionStatus === 'ACTIVE' && (
              <>
                <button onClick={() => handleNavigate('/calendar')}>
                  {t('profile.sellerAccount.buttons.calendar')}
                </button>
                <button onClick={() => handleNavigate('/create-studio')}>
                  {t('profile.sellerAccount.buttons.createStudio')}
                </button>
                <button onClick={() => handleNavigate('/my-subscription')}>
                  {t('profile.sellerAccount.buttons.mySubscriptions')}
                </button>
              </>
            )}
            <button onClick={() => handleNavigate('/subscription')}>
              {t('profile.sellerAccount.buttons.subscription')}
            </button>
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
