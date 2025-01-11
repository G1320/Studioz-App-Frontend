import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@contexts/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@hooks/utils';

export function HeaderNavigation() {
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('common');
  const location = useLocation();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => currentPath === path;

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
    <nav className="navbar">
      <Link
        to={`/${currLang}/wishlists`}
        className="navbar-link"
        aria-label={t('navigation.wishlists')}
        aria-current={isCurrentPage(`/${currLang}/wishlists`) ? 'page' : undefined}
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/wishlists');
        }}
      >
        {t('navigation.wishlists')}
      </Link>
      <Link
        to={`/${currLang}/services/music`}
        className="navbar-link"
        aria-label={t('navigation.services')}
        aria-current={isCurrentPage(`/${currLang}/services`) ? 'page' : undefined}
      >
        {t('navigation.services')}
      </Link>

      <Link
        to={`/${currLang}/studios`}
        className="navbar-link"
        aria-label={t('navigation.studios')}
        aria-current={isCurrentPage(`/${currLang}/studios`) ? 'page' : undefined}
      >
        {t('navigation.studios')}
      </Link>
    </nav>
  );
}
