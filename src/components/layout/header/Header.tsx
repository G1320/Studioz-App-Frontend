import { Link } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@components/index';
import { Cart, User } from '@models/index';
import { LanguageSwitcher } from '@components/translation';
import { useTranslation } from 'react-i18next';
interface HeaderProps {
  cart?: Cart;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({ cart, user }) => {
  const { t } = useTranslation('header');

  return (
    <header>
      <h1>
        <Link className="logo" to="/">
          {t('logo')}
        </Link>
      </h1>
      <>
        <LanguageSwitcher />
        <Profile />
        {user ? <LogoutButton /> : <LoginButton />}
      </>
      <CartItemsList cart={cart} isDropdown={true} />
      <Navbar />
    </header>
  );
};
