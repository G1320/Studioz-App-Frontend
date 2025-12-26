import { useState } from 'react';
import { useLanguageNavigate, useLanguageSwitcher } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';
import { LoginButton, LogoutButton, GoogleCalendarConnectButton } from '@features/auth';
import { PopupDropdown } from '@shared/components/drop-downs';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { WavyMenuIcon } from '@shared/components/icons';
import LanguageIcon from '@mui/icons-material/Language';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './styles/menu-dropdown.scss';

interface MenuDropdownProps {
  user: User | null;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ user }) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('profile');
  const { currentLanguage, changeLanguage: switchLanguage } = useLanguageSwitcher();
  const [isLangSubmenuOpen, setIsLangSubmenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    langNavigate(path);
    scrollToTop();
  };

  const changeLanguage = (lang: string) => {
    switchLanguage(lang);
    setIsLangSubmenuOpen(false);
  };

  return (
    <PopupDropdown
      trigger={
        <button className="header-menu-button-container header-icon-button" aria-label="Menu">
          <WavyMenuIcon className="wavy-menu-icon" aria-label="menu icon" />
        </button>
      }
      className="menu-dropdown"
      anchor="bottom-right"
      minWidth="200px"
      maxWidth="300px"
    >
      <div className="menu-dropdown__content">
        {!user && (
          <div className="menu-dropdown__item menu-dropdown__item--login">
            <LoginButton aria-label="Login" />
          </div>
        )}
        {user && (
          <>
            <button className="menu-dropdown__item" onClick={() => handleNavigate('/dashboard')}>
              <DashboardIcon className="menu-dropdown__icon" />
              <span>{t('profile.buttons.dashboard')}</span>
            </button>
            <button className="menu-dropdown__item" onClick={() => handleNavigate('/create-studio')}>
              <AddBusinessIcon className="menu-dropdown__icon" />
              <span>{t('profile.sellerAccount.buttons.createStudio')}</span>
            </button>
            {/* Show Google Calendar connect for all logged-in users (useful for studio owners) */}
            <GoogleCalendarConnectButton variant="menu-item" />
            {user?.subscriptionStatus === 'ACTIVE' && (
              <>
                <button className="menu-dropdown__item" onClick={() => handleNavigate('/calendar')}>
                  <CalendarTodayIcon className="menu-dropdown__icon" />
                  <span>{t('profile.sellerAccount.buttons.calendar')}</span>
                </button>
                <button className="menu-dropdown__item" onClick={() => handleNavigate('/my-subscription')}>
                  <CardMembershipIcon className="menu-dropdown__icon" />
                  <span>{t('profile.sellerAccount.buttons.mySubscriptions')}</span>
                </button>
              </>
            )}
          </>
        )}
        <button className="menu-dropdown__item" onClick={() => handleNavigate('/subscription')}>
          <CardMembershipIcon className="menu-dropdown__icon" />
          <span>{t('profile.sellerAccount.buttons.subscription')}</span>
        </button>
        {user && (
          <div className="menu-dropdown__item menu-dropdown__item--logout">
            <LogoutButton aria-label="Logout" className="menu-dropdown__logout-button" />
          </div>
        )}
        <div className="menu-dropdown__divider" />
        <div className="menu-dropdown__lang-item-wrapper">
          <button
            className="menu-dropdown__item menu-dropdown__item--lang"
            onClick={(e) => {
              e.stopPropagation();
              setIsLangSubmenuOpen(!isLangSubmenuOpen);
            }}
            aria-expanded={isLangSubmenuOpen}
            aria-haspopup="true"
          >
            <LanguageIcon className="menu-dropdown__icon" />
            <span>{t('profile.language')}</span>
            <ChevronRightIcon className="menu-dropdown__chevron" />
          </button>
          {isLangSubmenuOpen && (
            <div className="menu-dropdown__submenu">
              <button
                className={`menu-dropdown__submenu-item ${currentLanguage === 'en' ? 'menu-dropdown__submenu-item--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  changeLanguage('en');
                }}
              >
                English
              </button>
              <button
                className={`menu-dropdown__submenu-item ${currentLanguage === 'he' ? 'menu-dropdown__submenu-item--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  changeLanguage('he');
                }}
              >
                עברית
              </button>
            </div>
          )}
        </div>
        <button className="menu-dropdown__item menu-dropdown__item--link" onClick={() => handleNavigate('/privacy')}>
          {t('profile.legal.privacy')}
        </button>
        <button className="menu-dropdown__item menu-dropdown__item--link" onClick={() => handleNavigate('/terms')}>
          {t('profile.legal.terms')}
        </button>
      </div>
    </PopupDropdown>
  );
};
