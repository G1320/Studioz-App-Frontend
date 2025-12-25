import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@core/contexts';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { featureFlags } from '@core/config/featureFlags';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

export function HeaderNavbar() {
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('common');
  const location = useLocation();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => {
    // Check exact match or if path starts with the base path (for sub-routes)
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleNavigate = (path: string) => {
    if (!user?._id) {
      toast.error(t('errors.login_required'));
    } else if (path === '/wishlists' && (!user?.wishlists || user?.wishlists.length === 0)) {
      toast.error(t('errors.wishlist_empty'));
      langNavigate('/create-wishlist');
    } else {
      langNavigate(path);
    }
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
        to={`/${currLang}/wishlists`}
        className="navbar-link"
        aria-label={t('navigation.wishlists')}
        aria-current={isCurrentPage(`/${currLang}/wishlists`) ? 'page' : undefined}
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/wishlists');
          scrollToTop();
        }}
      >
        {t('navigation.wishlists')}
      </Link>
      <Link
        to={`/${currLang}/create-studio`}
        className="navbar-link"
        aria-label={t('navigation.create_studio')}
        aria-current={isCurrentPage(`/${currLang}/create-studio`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.create_studio')}
        <AddBusinessIcon className="navbar-link__icon" />
      </Link>
    </nav>
  );
}
