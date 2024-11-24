import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '@contexts/index';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { t } = useTranslation('header');

  const handleNavigate = (path: string) => {
    if (!user?._id) {
      toast.error(t('errors.login_required'));
    } else if (path === '/wishlists' && (!user?.wishlists || user?.wishlists.length === 0)) {
      toast.error(t('errors.wishlist_empty'));
      navigate('/create-wishlist');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/services">{t('services')}</Link>
      <Link
        to="/wishlists"
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/wishlists');
        }}
      >
        {t('wishlists')}
      </Link>
      <Link
        to="/create-studio"
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/create-studio');
        }}
      >
        {t('create_studio')}
      </Link>
    </nav>
  );
}
