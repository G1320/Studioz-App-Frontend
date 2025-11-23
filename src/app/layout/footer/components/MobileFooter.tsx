import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';

export const MobileFooter = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation('common');

  const currentPath = location.pathname;

  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => {
    // For home page, check exact match only (no sub-routes)
    if (path === `/${currLang}` || path === currLang) {
      return currentPath === `/${currLang}` || currentPath === `/${currLang}/`;
    }
    // For other pages, check exact match or if path starts with the base path (for sub-routes)
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <footer className="mobile-footer">
      <nav className="footer-grid">
        <Link
          to={`${currLang}`}
          className="footer-icon-link"
          aria-label={t('navigation.home')}
          aria-current={isCurrentPage(`/${currLang}`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          <div className="footer-link-content">
            <HomeIcon aria-hidden="true" />
            <span>{t('navigation.home')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/studios`}
          className="footer-icon-link"
          aria-label={t('navigation.studios')}
          aria-current={isCurrentPage(`/${currLang}/studios`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          <div className="footer-link-content">
            <BusinessIcon aria-hidden="true" />
            <span>{t('navigation.studios')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/services`}
          className="footer-icon-link"
          aria-label={t('navigation.services')}
          aria-current={isCurrentPage(`/${currLang}/services`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          <div className="footer-link-content">
            <GraphicEqIcon aria-hidden="true" />
            <span>{t('navigation.services')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/search`}
          className="footer-icon-link"
          aria-label={t('navigation.search')}
          aria-current={isCurrentPage(`/${currLang}/search`) ? 'page' : undefined}
          onClick={() => scrollToTop()}
        >
          <div className="footer-link-content">
            <SearchIcon aria-hidden="true" />
            <span>{t('navigation.search')}</span>
          </div>
        </Link>
      </nav>
    </footer>
  );
};
