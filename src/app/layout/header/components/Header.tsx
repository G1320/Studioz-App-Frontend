import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoginButton } from '@features/auth';
import { HeaderNavbar } from '@features/navigation';
import { Cart, User } from 'src/types/index';
import { LanguageSwitcher } from '@features/translation';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { BackButton } from '@shared/components';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { getCityFromCoordinates } from '@shared/services/map-service';
import { useCities } from '@shared/hooks/utils/cities';

interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

const shouldShowBackButton = (pathname: string): boolean => {
  // Show back button on all pages except home page
  // Home page patterns: /en, /he, /en/, /he/
  const homePagePattern = /^\/[a-z]{2}\/?$/;
  return !homePagePattern.test(pathname);
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
    <header className="app-header">
      <a href="#main-content" className="skip-link">
        Skip to Content
      </a>
      <BackButton className={`header-back-button ${showBackButton ? 'header-back-button--visible' : ''}`} />

      <h1 className={showBackButton ? 'logo--mobile-shifted' : ''}>
        <Link className="logo" to={`${currLang}`} aria-label={t('navigation.home')} onClick={() => scrollToTop()}>
          Studioz
        </Link>
      </h1>
      {currentCity && (
        <span className="header-current-city" aria-label={`Current city: ${getDisplayByCityName(currentCity)}`}>
          {getDisplayByCityName(currentCity)}
        </span>
      )}
      <div className="cart-options-container">
        <Link
          to={`${currLang}/search`}
          className="header-search-button-container"
          aria-label="Go to search page"
          onClick={() => scrollToTop()}
        >
          <SearchIcon aria-label="Search icon" />
        </Link>
        <LanguageSwitcher aria-label="Switch language" />
        {/* <ShoppingCart cart={cart} aria-label="Shopping cart" /> */}
        {user && (
          <Link
            to={`${currLang}/profile`}
            className="header-profile-button-container"
            aria-label="Go to profile page"
            onClick={() => scrollToTop()}
          >
            <ManageAccountsIcon aria-label="profile icon" />
          </Link>
        )}
        {!user && <LoginButton aria-label="Login" />}
      </div>
      <HeaderNavbar />
    </header>
  );
};
