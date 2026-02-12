import '../styles/_index.scss';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { useAnchorNavigate } from '@shared/hooks/utils';
import { featureFlags } from '@core/config/featureFlags';

export function HeaderNavbar() {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const anchorNavigate = useAnchorNavigate();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => {
    // Check exact match or if path starts with the base path (for sub-routes)
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    anchorNavigate('', 'how-it-works'); // Empty path = home page
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    anchorNavigate('/for-owners', 'pricing');
  };

  return (
    <nav id="main-navigation" className="navbar" aria-label={t('navigation.mainNavigation', 'Main Navigation')}>
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
      <a
        href={`/${currLang}#how-it-works`}
        className="navbar-link"
        aria-label={t('navigation.howItWorks')}
        onClick={handleHowItWorksClick}
      >
        {t('navigation.howItWorks')}
      </a>
      <a
        href={`/${currLang}/for-owners#pricing`}
        className="navbar-link"
        aria-label={t('navigation.pricing')}
        onClick={handlePricingClick}
      >
        {t('navigation.pricing')}
      </a>
    </nav>
  );
}
