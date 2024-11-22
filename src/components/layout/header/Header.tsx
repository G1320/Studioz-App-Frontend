import { Link, useNavigate } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@components/index';
import { Cart, User } from '@models/index';
import { LanguageSwitcher } from '@components/translation';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({ cart, user }) => {
  const { t } = useTranslation('header');
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header>
      <h1>
        <Link className="logo" to="/">
          {t('logo')}
        </Link>
      </h1>
      <LanguageSwitcher />
      <span onClick={handleSearchClick} className="header-search-button-container">
        <SearchIcon />
      </span>
      <div className="cart-profile-container">
        <CartItemsList cart={cart} isDropdown={true} />
        {user ? <LogoutButton /> : <LoginButton />}
        <Profile />
      </div>
      <Navbar />
    </header>
  );
};
