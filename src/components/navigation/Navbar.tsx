import { Link } from 'react-router-dom';
import { useUserContext } from '@contexts/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@hooks/utils';

export function Navbar() {
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('common');

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
      <Link to={`/${i18n.language}/services`}>{t('navigation.services')}</Link>
      <Link
        to={`/${i18n.language}/wishlists`}
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/wishlists');
        }}
      >
        {t('navigation.wishlists')}
      </Link>
      <Link
        to={`/${i18n.language}/create-studio`}
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/create-studio');
        }}
      >
        {t('navigation.list_studio')}
      </Link>
    </nav>
  );
}
