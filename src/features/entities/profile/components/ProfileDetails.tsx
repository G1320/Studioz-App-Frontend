import { useLanguageNavigate } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';
import { LogoutButton } from '@features/auth';
import { ProfileImageUploader } from '@shared/components';
import { useUserContext } from '@core/contexts';
import { setLocalUser } from '@shared/services';
import { useUpdateUserMutation } from '@shared/hooks/mutations';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface ProfileDetailsProps {
  user: User | null;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('profile');
  const { setUser } = useUserContext();
  const updateUserMutation = useUpdateUserMutation();

  const handleNavigate = (path: string) => {
    langNavigate(path);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (!user?._id) {
      return;
    }

    updateUserMutation.mutate(
      { avatar: imageUrl },
      {
        onSuccess: (updatedUser) => {
          setLocalUser(updatedUser);
          setUser(updatedUser);
        }
      }
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar-wrapper">
            {user ? (
              <ProfileImageUploader
                currentImageUrl={user.avatar || user.picture}
                onImageUpload={handleImageUpload}
                userId={user._id}
              />
            ) : (
              <div className="profile-avatar profile-avatar--guest">
                <AccountCircleIcon className="avatar-icon" />
              </div>
            )}
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name || t('profile.guestUser')}</h1>
          <p className="profile-email">{user?.email || t('profile.email.notAvailable')}</p>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-section profile-actions-section">
          <h2 className="profile-section__title">{t('profile.actions.title')}</h2>
          <div className="profile-actions">
            {user && (
              <>
                <button className="profile-action-button" onClick={() => handleNavigate('/dashboard')}>
                  <DashboardIcon className="profile-action-icon" />
                  <span>{t('profile.buttons.dashboard')}</span>
                </button>
              </>
            )}
            {user?.subscriptionStatus === 'ACTIVE' && (
              <>
                <button className="profile-action-button" onClick={() => handleNavigate('/calendar')}>
                  <CalendarTodayIcon className="profile-action-icon" />
                  <span>{t('profile.sellerAccount.buttons.calendar')}</span>
                </button>
                <button className="profile-action-button" onClick={() => handleNavigate('/create-studio')}>
                  <AddBusinessIcon className="profile-action-icon" />
                  <span>{t('profile.sellerAccount.buttons.createStudio')}</span>
                </button>
                <button className="profile-action-button" onClick={() => handleNavigate('/my-subscription')}>
                  <CardMembershipIcon className="profile-action-icon" />
                  <span>{t('profile.sellerAccount.buttons.mySubscriptions')}</span>
                </button>
              </>
            )}
            <button className="profile-action-button" onClick={() => handleNavigate('/subscription')}>
              <CardMembershipIcon className="profile-action-icon" />
              <span>{t('profile.sellerAccount.buttons.subscription')}</span>
            </button>
            {user && (
              <LogoutButton aria-label="Logout" className="profile-action-button profile-action-button--logout" />
            )}
          </div>
        </div>

        <div className="profile-section legal-links">
          <h2 className="profile-section__title">{t('profile.legal.title')}</h2>
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
