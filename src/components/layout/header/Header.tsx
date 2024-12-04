import { Link } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@components/index';
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
      <h1>
        <Link className="logo" to={`${currLang}`}>
          {t('navigation.logo')}
        </Link>
      </h1>
      <LanguageSwitcher />
      <Link to={`${currLang}/search`} className="header-search-button-container">
        <SearchIcon />
      </Link>
      <div className="cart-profile-container">
        <CartItemsList cart={cart} isDropdown={true} />
        {user ? <LogoutButton /> : <LoginButton />}
        <Profile />
      </div>
      <Navbar />
    </header>
  );
};
