import { Link } from 'react-router-dom';
import { HeaderNavigation, ShoppingCart, LoginButton, LogoutButton } from '@components/index';
import { Cart, User } from 'src/types/index';
import { LanguageSwitcher } from '@components/translation';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({ cart, user }) => {
  const { t, i18n } = useTranslation('common');

  const currLang = i18n.language || 'en';

  return (
    <header>
      <a href="#main-content" className="skip-link">
        Skip to Content
      </a>
      <h1>
        <Link className="logo" to={`${currLang}`} aria-label={t('navigation.home')}>
          {t('navigation.logo')}
        </Link>
      </h1>
      <div className="cart-options-container">
        <Link to={`${currLang}/search`} className="header-search-button-container" aria-label="Go to search page">
          <SearchIcon aria-label="Search icon" />
        </Link>
        <LanguageSwitcher aria-label="Switch language" />
        <ShoppingCart cart={cart} aria-label="Shopping cart" />
        {user ? <LogoutButton aria-label="Logout" /> : <LoginButton aria-label="Login" />}
      </div>
      <HeaderNavigation />
    </header>
  );
};
