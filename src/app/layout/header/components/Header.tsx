import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { HeaderNavbar } from '@features/navigation';
import { Cart, User } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { LocationIcon } from '@shared/components/icons';
import { BackButton } from '@shared/components';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useCities } from '@shared/hooks/utils/cities';
import { useAuth0LoginHandler } from '@shared/hooks';
import { useLanguageSwitcher } from '@shared/hooks/utils';
import { featureFlags } from '@core/config/featureFlags';
import { MenuDropdown } from './MenuDropdown';
import { ThemeToggle } from '@shared/components';

// Lazy-load NotificationBell — only needed for logged-in users
const LazyNotificationBell = lazy(() =>
  import('@shared/components/notifications/components/NotificationBell').then((m) => ({
    default: m.NotificationBell
  }))
);

interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

const shouldShowBackButton = (pathname: string): boolean => {
  // Show back button on all pages except landing page
  // Landing page patterns: /en, /he, /en/, /he/
  const landingPagePattern = /^\/[a-z]{2}\/?$/;
  return !landingPagePattern.test(pathname);
};

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const { userLocation } = useLocationPermission();
  const { getDisplayByCityName } = useCities();
  const { loginWithPopup } = useAuth0LoginHandler();
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const currLang = i18n.language || 'en';
  const showBackButton = shouldShowBackButton(location.pathname);

  useEffect(() => {
    const fetchCity = async () => {
      if (userLocation) {
        try {
          // Lazy load map-service to keep Mapbox SDK out of main bundle
          const { getCityFromCoordinates } = await import('@shared/services/map-service');
          const city = await getCityFromCoordinates(userLocation.latitude, userLocation.longitude);
          setCurrentCity(city);
        } catch (error) {
          console.error('Error fetching city from coordinates:', error);
          setCurrentCity(null);
        }
      } else {
        setCurrentCity(null);
      }
    };

    fetchCity();
  }, [userLocation]);

  return (
    <>
      <div className="skip-links-container">
        <a href="#main-content" className="skip-link">
          {t('navigation.skipToContent', 'Skip to Content')}
        </a>
        <a href="#main-navigation" className="skip-link">
          {t('navigation.skipToNavigation', 'Skip to Navigation')}
        </a>
        <a href="#main-footer" className="skip-link">
          {t('navigation.skipToFooter', 'Skip to Footer')}
        </a>
      </div>
      <header className="app-header">
        {featureFlags.headerBackButton && (
          <BackButton className={`header-back-button ${showBackButton ? 'header-back-button--visible' : ''}`} />
        )}

        <div className={`site-logo ${featureFlags.headerBackButton && showBackButton ? 'logo--mobile-shifted' : ''}`}>
          <Link className="logo" to={`/${currLang}`} aria-label={t('navigation.home')} onClick={() => scrollToTop()}>
            {featureFlags.faviconLogo ? (
              <>
                <img src="/android-chrome-192x192.png" alt="" className="logo-image" width={40} height={40} />
                <span className="logo-wordmark">Studioz</span>
              </>
            ) : (
              'Studioz'
            )}
          </Link>
        </div>
        {featureFlags.headerCurrentCity && currentCity && (
          <span className="header-current-city" aria-label={`Current city: ${getDisplayByCityName(currentCity)}`}>
            <LocationIcon className="header-current-city__icon" aria-hidden="true" />
            {getDisplayByCityName(currentCity)}
          </span>
        )}
        <div className="header-options-container">
          {/* <ShoppingCart cart={cart} aria-label="Shopping cart" /> */}
          {user && featureFlags.notifications && (
            <Suspense fallback={null}>
              <LazyNotificationBell />
            </Suspense>
          )}
          <div className="header-desktop-preferences">
            <ThemeToggle size="sm" />
            <button
              type="button"
              className="header-language-button"
              onClick={() => changeLanguage(currentLanguage === 'he' ? 'en' : 'he')}
              aria-label={currentLanguage === 'he' ? t('navigation.switchToEnglish') : t('navigation.switchToHebrew')}
            >
              {currentLanguage === 'he' ? 'EN' : 'עברית'}
            </button>
          </div>
          {!user && (
            <div className="header-auth-actions">
              <button type="button" className="header-login-button" onClick={() => void loginWithPopup()}>
                {t('buttons.log_in')}
              </button>
              <button
                type="button"
                className="header-signup-button"
                onClick={() =>
                  void loginWithPopup({
                    authorizationParams: { screen_hint: 'signup' }
                  })
                }
              >
                {t('buttons.sign_up')}
              </button>
            </div>
          )}
          {user && (
            <div className="header-desktop-user-menu">
              <MenuDropdown user={user} triggerVariant="avatar" />
            </div>
          )}
          <div className="header-mobile-menu">
            <MenuDropdown user={user || null} />
          </div>
        </div>
        <HeaderNavbar user={user} />
      </header>
    </>
  );
};
