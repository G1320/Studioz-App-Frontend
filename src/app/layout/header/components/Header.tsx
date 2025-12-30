import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HeaderNavbar } from '@features/navigation';
import { Cart, User } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { NotificationBell } from '@shared/components/notifications';
import { BackButton } from '@shared/components';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { getCityFromCoordinates } from '@shared/services/map-service';
import { useCities } from '@shared/hooks/utils/cities';
import { featureFlags } from '@core/config/featureFlags';
import { MenuDropdown } from './MenuDropdown';

interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

const shouldShowBackButton = (pathname: string): boolean => {
  // Show back button on all pages except landing page and discover page
  // Landing page patterns: /en, /he, /en/, /he/
  const landingPagePattern = /^\/[a-z]{2}\/?$/;
  // Discover page patterns: /en/discover, /he/discover
  const discoverPagePattern = /^\/[a-z]{2}\/discover\/?$/;
  return !landingPagePattern.test(pathname) && !discoverPagePattern.test(pathname);
};

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const { userLocation } = useLocationPermission();
  const { getDisplayByCityName } = useCities();
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const currLang = i18n.language || 'en';
  const showBackButton = shouldShowBackButton(location.pathname);

  useEffect(() => {
    const fetchCity = async () => {
      if (userLocation) {
        try {
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
        <BackButton className={`header-back-button ${showBackButton ? 'header-back-button--visible' : ''}`} />

        <h1 className={showBackButton ? 'logo--mobile-shifted' : ''}>
          <Link className="logo" to={`/${currLang}/discover`} aria-label={t('navigation.home')} onClick={() => scrollToTop()}>
            {featureFlags.faviconLogo ? (
              <img src="/android-chrome-512x512.png" alt="Studioz" className="logo-image" />
            ) : (
              'Studioz'
            )}
          </Link>
        </h1>
        {featureFlags.headerCurrentCity && currentCity && (
          <span className="header-current-city" aria-label={`Current city: ${getDisplayByCityName(currentCity)}`}>
            <LocationOnIcon className="header-current-city__icon" aria-hidden="true" />
            {getDisplayByCityName(currentCity)}
          </span>
        )}
        <div className="header-options-container">
          {featureFlags.headerSearchIcon && (
            <Link
              to={`${currLang}/search`}
              className="header-search-button-container header-icon-button"
              aria-label="Go to search page"
              onClick={() => scrollToTop()}
            >
              <SearchIcon aria-label="Search icon" />
            </Link>
          )}
          {/* <ShoppingCart cart={cart} aria-label="Shopping cart" /> */}
          {user && featureFlags.notifications && <NotificationBell />}
          <MenuDropdown user={user || null} />
        </div>
        <HeaderNavbar />
        <Link
          to={`/${currLang}/create-studio`}
          className="header-list-studio-button-mobile"
          aria-label={t('navigation.create_studio')}
          onClick={() => scrollToTop()}
        >
          {t('navigation.create_studio')}
          <AddBusinessIcon className="header-list-studio-button-mobile__icon" />
        </Link>
      </header>
    </>
  );
};
