import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { featureFlags } from '@core/config/featureFlags';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

export function HeaderNavbar() {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => {
    // Check exact match or if path starts with the base path (for sub-routes)
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <nav id="main-navigation" className="navbar" aria-label={t('navigation.mainNavigation', 'Main Navigation')}>
      <Link
        to={`/${currLang}/studios`}
        className="navbar-link"
        aria-label={t('navigation.studios')}
        aria-current={isCurrentPage(`/${currLang}/studios`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.studios')}
      </Link>

      {featureFlags.servicesPage && (
        <Link
          to={`/${currLang}/services/music`}
          className="navbar-link"
          aria-label={t('navigation.services')}
          aria-current={isCurrentPage(`/${currLang}/services`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          {t('navigation.services')}
        </Link>
      )}
      <Link
        to={`/${currLang}/reservations`}
        className="navbar-link"
        aria-label={t('navigation.reservations')}
        aria-current={isCurrentPage(`/${currLang}/reservations`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.reservations')}
      </Link>
      <Link
        to={`/${currLang}/create-studio`}
        className="navbar-link"
        aria-label={t('navigation.create_studio')}
        aria-current={isCurrentPage(`/${currLang}/for-owners`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.create_studio')}
        <AddBusinessIcon className="navbar-link__icon" />
      </Link>
    </nav>
  );
}
