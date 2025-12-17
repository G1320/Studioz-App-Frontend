import { useLanguageNavigate } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';
import { LoginButton, LogoutButton } from '@features/auth';
import { PopupDropdown } from '@shared/components/drop-downs';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { LanguageSwitcher } from '@features/translation';
import './styles/profile-dropdown.scss';

interface ProfileDropdownProps {
  user: User | null;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('profile');

  const handleNavigate = (path: string) => {
    langNavigate(path);
    scrollToTop();
  };

  return (
    <PopupDropdown
      trigger={
        <button
          className="header-profile-button-container header-icon-button"
          aria-label={user ? 'Profile menu' : 'Login / Sign up'}
        >
          <ManageAccountsIcon aria-label="profile icon" />
        </button>
      }
      className="profile-dropdown"
      anchor="bottom-right"
      minWidth="200px"
      maxWidth="300px"
    >
      <div className="profile-dropdown__content">
        {!user && (
          <div className="profile-dropdown__item profile-dropdown__item--login">
            <LoginButton aria-label="Login" />
          </div>
        )}
        {user && (
          <>
            <button className="profile-dropdown__item" onClick={() => handleNavigate('/dashboard')}>
              <DashboardIcon className="profile-dropdown__icon" />
              <span>{t('profile.buttons.dashboard')}</span>
            </button>
            <button className="profile-dropdown__item" onClick={() => handleNavigate('/create-studio')}>
              <AddBusinessIcon className="profile-dropdown__icon" />
              <span>{t('profile.sellerAccount.buttons.createStudio')}</span>
            </button>
            {user?.subscriptionStatus === 'ACTIVE' && (
              <>
                <button className="profile-dropdown__item" onClick={() => handleNavigate('/calendar')}>
                  <CalendarTodayIcon className="profile-dropdown__icon" />
                  <span>{t('profile.sellerAccount.buttons.calendar')}</span>
                </button>
                <button className="profile-dropdown__item" onClick={() => handleNavigate('/my-subscription')}>
                  <CardMembershipIcon className="profile-dropdown__icon" />
                  <span>{t('profile.sellerAccount.buttons.mySubscriptions')}</span>
                </button>
              </>
            )}
          </>
        )}
        <button className="profile-dropdown__item" onClick={() => handleNavigate('/subscription')}>
          <CardMembershipIcon className="profile-dropdown__icon" />
          <span>{t('profile.sellerAccount.buttons.subscription')}</span>
        </button>
        {user && (
          <div className="profile-dropdown__item profile-dropdown__item--logout">
            <LogoutButton aria-label="Logout" className="profile-dropdown__logout-button" />
          </div>
        )}
        <div className="profile-dropdown__divider" />
        <div className="profile-dropdown__lang-switcher">
          <span className="profile-dropdown__lang-label">{t('profile.language', 'Language')}</span>
          <LanguageSwitcher />
        </div>
        <button
          className="profile-dropdown__item profile-dropdown__item--link"
          onClick={() => handleNavigate('/privacy')}
        >
          {t('profile.legal.privacy')}
        </button>
        <button
          className="profile-dropdown__item profile-dropdown__item--link"
          onClick={() => handleNavigate('/terms')}
        >
          {t('profile.legal.terms')}
        </button>
      </div>
    </PopupDropdown>
  );
};
