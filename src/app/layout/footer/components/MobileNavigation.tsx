import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { featureFlags } from '@core/config/featureFlags';

export const MobileNavigation = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation('common');

  // Feature flag check - disable entire mobile navigation
  if (!featureFlags.mobileFooterNavigation) {
    return null;
  }

  const currentPath = location.pathname;

  const currLang = i18n.language || 'en';

  // Hide mobile navigation on create/edit forms, landing page, and for-owners page
  const hiddenPaths = ['/create-studio', '/edit-studio', '/create-item', '/edit-item', '/for-owners'];
  const isLandingPage = currentPath === '/' || currentPath === `/${currLang}` || currentPath === `/${currLang}/`;
  if (isLandingPage || hiddenPaths.some((path) => currentPath.includes(path))) {
    return null;
  }

  const isCurrentPage = (path: string) => {
    // Check exact match or if path starts with the base path (for sub-routes)
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <nav className="mobile-navigation" aria-label={t('navigation.main', 'Main navigation')}>
      <div className="mobile-navigation__grid">
        <Link
          to={`/${currLang}/studios`}
          className="mobile-navigation__link"
          aria-label={t('navigation.home')}
          aria-current={isCurrentPage(`/${currLang}/studios`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          <div className="mobile-navigation__link-content">
            <HomeIcon aria-hidden="true" />
            <span>{t('navigation.home')}</span>
          </div>
        </Link>
        {featureFlags.servicesPage && (
          <Link
            to={`/${currLang}/services`}
            className="mobile-navigation__link"
            aria-label={t('navigation.services')}
            aria-current={isCurrentPage(`/${currLang}/services`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            <div className="mobile-navigation__link-content">
              <GraphicEqIcon aria-hidden="true" />
              <span>{t('navigation.services')}</span>
            </div>
          </Link>
        )}
        <Link
          to={`/${currLang}/reservations`}
          className="mobile-navigation__link"
          aria-label={t('navigation.reservations')}
          aria-current={isCurrentPage(`/${currLang}/reservations`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          <div className="mobile-navigation__link-content">
            <EventNoteIcon aria-hidden="true" />
            <span>{t('navigation.reservations')}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};
