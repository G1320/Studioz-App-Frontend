import { Link } from 'react-router-dom';
import { Navbar, CartItemsList, LoginButton, LogoutButton, Profile } from '@/components'

import { useUserContext } from '@/contexts';
import { useCart } from '@/hooks'
import { Item } from '@/types/index';
import { useAuth0 } from '@auth0/auth0-react';

interface HeaderProps{
  filteredItems?: Item[];

}

 export const Header: React.FC<HeaderProps> = ({ filteredItems = [] }) => {
  const { user } = useUserContext();
  const { isLoading, error } = useAuth0();
  const { data: cartItems = [] } = useCart(user?._id || '');  

  const items = user ? cartItems : filteredItems ;

  
  return (
    <header>
      {error && <p>Oops... Authentication error</p>}
      {!error && isLoading && <p>Loading...</p>}
      {!error && !isLoading && (
        <>
          <Profile />
          <LoginButton />
          <LogoutButton />
        </>
      )}
      <h1>
        <Link to="/">Studioz</Link>
      </h1>
      <CartItemsList items={items} isDropdown={true} />
      <Navbar />
    </header>
  );
};

export default Header;
