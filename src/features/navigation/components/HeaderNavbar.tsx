import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { featureFlags } from '@core/config/featureFlags';
import { AddIcon } from '@shared/components/icons';

export function HeaderNavbar() {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => {
    // Check exact match or if path starts with the base path (for sub-routes)
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const isHomePage = currentPath === '/' || currentPath === `/${currLang}` || currentPath === `/${currLang}/`;

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      // Already on home page, just scroll to section
      const element = document.getElementById('how-it-works');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home page with hash
      navigate(`/${currLang}#how-it-works`);
    }
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
      <Link
        to={`/${currLang}/studio/create`}
        className="navbar-link"
        aria-label={t('navigation.create_studio')}
        aria-current={isCurrentPage(`/${currLang}/studio/create`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.create_studio')}
        <AddIcon className="navbar-link__icon" />
      </Link>
    </nav>
  );
}
