import { useState } from 'react';
import { useLanguageNavigate, useLanguageSwitcher, useSentryFeedback } from '@shared/hooks/utils';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/types/index';
import { LogoutButton } from '@features/auth';
import { PopupDropdown } from '@shared/components/drop-downs';
import { ThemeToggle } from '@shared/components';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import {
  WavyMenuIcon,
  AddBusinessIcon,
  DashboardIcon,
  FavoriteIcon,
  PersonOutlineIcon,
  EventIcon,
  LanguageIcon,
  ChevronRightIcon,
} from '@shared/components/icons';
import { useAuth0LoginHandler } from '@shared/hooks';
import './styles/menu-dropdown.scss';

interface MenuDropdownProps {
  user: User | null;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ user }) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation(['profile', 'common']);
  const { currentLanguage, changeLanguage: switchLanguage } = useLanguageSwitcher();
  const [isLangSubmenuOpen, setIsLangSubmenuOpen] = useState(false);
  const { loginWithPopup } = useAuth0LoginHandler();
  const { openFeedback } = useSentryFeedback();

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
        {/* Login - only for non-logged-in users */}
        {!user && (
          <button className="menu-dropdown__item" onClick={() => loginWithPopup()}>
            <PersonOutlineIcon className="menu-dropdown__icon" />
            <span>{t('common:buttons.loginSignup')}</span>
          </button>
        )}

        {/* Logged-in user items - organized by priority */}
        {user && (
          <>
            <button className="menu-dropdown__item" onClick={() => handleNavigate('/profile')}>
              <PersonOutlineIcon className="menu-dropdown__icon" />
              <span>{t('profile.buttons.profile')}</span>
            </button>
            <button className="menu-dropdown__item" onClick={() => handleNavigate('/reservations')}>
              <EventIcon className="menu-dropdown__icon" />
              <span>{t('profile.buttons.reservations')}</span>
            </button>
            <button className="menu-dropdown__item" onClick={() => handleNavigate('/wishlists')}>
              <FavoriteIcon className="menu-dropdown__icon" />
              <span>{t('profile.buttons.wishlists')}</span>
            </button>
            <button className="menu-dropdown__item" onClick={() => handleNavigate('/dashboard')}>
              <DashboardIcon className="menu-dropdown__icon" />
              <span>{t('profile.buttons.dashboard')}</span>
            </button>
          </>
        )}

        {/* List studio - available to all, mobile-only for non-logged-in */}
        <button
          className={`menu-dropdown__item ${!user ? 'menu-dropdown__item--mobile-only' : ''}`}
          onClick={() => handleNavigate('/studio/create')}
        >
          <AddBusinessIcon className="menu-dropdown__icon" />
          <span>{t('profile.sellerAccount.buttons.createStudio')}</span>
        </button>

        {/* Mobile-only reservations for non-logged-in users */}
        {!user && (
          <button
            className="menu-dropdown__item menu-dropdown__item--mobile-only"
            onClick={() => handleNavigate('/reservations')}
          >
            <EventIcon className="menu-dropdown__icon" />
            <span>{t('profile.buttons.reservations')}</span>
          </button>
        )}

        {user && (
          <div className="menu-dropdown__item menu-dropdown__item--logout">
            <LogoutButton aria-label="Logout" className="menu-dropdown__logout-button" />
          </div>
        )}
        <div className="menu-dropdown__divider" />
        <div className="menu-dropdown__theme-item">
          <ThemeToggle variant="dropdown" size="sm" />
        </div>
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
        <button className="menu-dropdown__item menu-dropdown__item--link" onClick={openFeedback}>
          {t('profile.legal.feedback')}
        </button>
      </div>
    </PopupDropdown>
  );
};
