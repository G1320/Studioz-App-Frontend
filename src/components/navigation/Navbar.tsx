import { useNavigate } from 'react-router-dom';
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
      <a href="/services">{t('services')}</a>
      <a
        href="/wishlists"
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/wishlists');
        }}
      >
        {t('wishlists')}
      </a>
      <a
        href="/create-studio"
        onClick={(e) => {
          e.preventDefault();
          handleNavigate('/create-studio');
        }}
      >
        {t('create_studio')}
      </a>
    </nav>
  );
}
