import { Link } from 'react-router-dom';
import { LoginButton, LogoutButton } from '@features/auth';
import { HeaderNavbar } from '@features/navigation';
import { Cart, User } from 'src/types/index';
import { LanguageSwitcher } from '@features/translation';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation('common');

  const currLang = i18n.language || 'en';

  return (
    <header className="app-header">
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
        {/* <ShoppingCart cart={cart} aria-label="Shopping cart" /> */}
        {user && (
          <Link to={`${currLang}/profile`} className="header-profile-button-container" aria-label="Go to search page">
            <ManageAccountsIcon aria-label="profile icon" />
          </Link>
        )}
        {user ? <LogoutButton aria-label="Logout" /> : <LoginButton aria-label="Login" />}
      </div>
      <HeaderNavbar />
    </header>
  );
};
