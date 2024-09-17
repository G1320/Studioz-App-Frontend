import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@/components';
import { useUserContext } from '@/contexts';
import { useCart } from '@/hooks';
import { Item } from '@/types/index';
import { useAuth0 } from '@auth0/auth0-react';

interface HeaderProps {
  filteredItems?: Item[];
}

export const Header: React.FC<HeaderProps> = ({ filteredItems = [] }) => {
  const { user } = useUserContext();
  const { isLoading, error } = useAuth0();
  const { data: cartItems = [] } = useCart(user?._id || '');
  const items = user ? cartItems : filteredItems;
  const navigate = useNavigate();

  // Redirect to home if authentication fails
  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error);
      // Redirect to the homepage on authentication failure
      navigate('/');
    }
  }, [error, navigate]);

  return (
    <header>
        <>
          <Profile />
          <LoginButton />
          <LogoutButton />
        </>
      <h1>
        <Link to="/">Studioz</Link>
      </h1>
      <CartItemsList items={items} isDropdown={true} />
      <Navbar />
    </header>
  );
};

export default Header;
