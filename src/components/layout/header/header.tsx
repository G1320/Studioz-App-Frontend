import { Navbar } from '../../navigation/navbar/navbar';
import CartItemsList from '../../entities/cart/cartItemsList';
import Profile from '../../auth/profile';

import LoginButton from '../../auth/login-button';
import LogoutButton from '../../auth/logout-button';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '../../../contexts/UserContext';
import { useCart } from '../../../hooks/dataFetching/useCart';
import { Link } from 'react-router-dom';
import {  Item } from '../../../../../shared/types';

interface HeaderProps{
  filteredItems?: Item[];

}

const header: React.FC<HeaderProps> = ({ filteredItems = [] }) => {
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

export default header;
