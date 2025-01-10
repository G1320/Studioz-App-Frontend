import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import { useUserContext } from '@contexts/UserContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@hooks/utils';

export const MobileFooter = () => {
  const location = useLocation();
  const { user } = useUserContext();
  const { t, i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();

  const currentPath = location.pathname;

  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => currentPath === path;

  const handleNavigate = (path: string) => {
    if (!user?._id) {
      toast.error(t('errors.login_required'));
    } else {
      langNavigate(path);
    }
  };

  return (
    <footer className="mobile-footer">
      <nav className="footer-grid">
        <Link
          to={`${currLang}`}
          className="footer-icon-link"
          aria-label={t('navigation.home')}
          aria-current={isCurrentPage(`/${currLang}`) ? 'page' : undefined}
        >
          <div className="footer-link-content">
            <HomeIcon aria-hidden="true" />
            <span>{t('navigation.home')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/services`}
          className="footer-icon-link"
          aria-label={t('navigation.services')}
          aria-current={isCurrentPage(`/${currLang}/services`) ? 'page' : undefined}
        >
          <div className="footer-link-content">
            <GraphicEqIcon aria-hidden="true" />
            <span>{t('navigation.services')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/studios`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('/studios');
          }}
          className="footer-icon-link"
          aria-label={t('navigation.studios')}
          aria-current={isCurrentPage(`/${currLang}/create-studio`) ? 'page' : undefined}
        >
          <div className="footer-link-content">
            <BusinessIcon aria-hidden="true" />
            <span>{t('navigation.studios')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/search`}
          className="footer-icon-link"
          aria-label={t('navigation.search')}
          aria-current={isCurrentPage(`/${currLang}/search`) ? 'page' : undefined}
        >
          <div className="footer-link-content">
            <SearchIcon aria-hidden="true" />
            <span>{t('navigation.search')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/studios`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('/studios');
          }}
          className="footer-icon-link"
          aria-label={t('navigation.studios')}
          aria-current={isCurrentPage(`/${currLang}/create-studio`) ? 'page' : undefined}
        >
          <div className="footer-link-content">
            <BusinessIcon aria-hidden="true" />
            <span>{t('navigation.studios')}</span>
          </div>
        </Link>
      </nav>
    </footer>
  );
};
