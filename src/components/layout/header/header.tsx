import { Link } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@/components';
import { useUserContext } from '@/contexts';
import { useCart } from '@/hooks';
import { Item } from '@/types/index';
interface HeaderProps {
  filteredItems?: Item[];
}

export const Header: React.FC<HeaderProps> = ({ filteredItems = [] }) => {
  const { user } = useUserContext();
  const { data: cartItems = [] } = useCart(user?._id || '');
  const items = user ? cartItems : filteredItems;


  return (
    <header>
      <h1>
        <Link className='logo' to="/">Studioz</Link>
      </h1>
        <>
          <Profile />
          <LoginButton />
          <LogoutButton />
        </>
      <CartItemsList items={items} isDropdown={true} />
      <Navbar />
    </header>
  );
};

export default Header;
