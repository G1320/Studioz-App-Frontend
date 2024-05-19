import React from 'react';
import { Navbar } from '../../navigation/navbar/navbar';
import CartItemsList from '../../entities/cart/cartItemsList';
import Profile from '../../auth/profile';

import LoginButton from '../../auth/login-button';
import LogoutButton from '../../auth/logout-button';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '../../../contexts/UserContext';
import { useUserCart } from '../../../hooks/dataFetching/useUserCart';
import { Link } from 'react-router-dom';

const header = ({ filteredItems = null }) => {
  const { user } = useUserContext();
  const { isLoading, error } = useAuth0();
  const { data: cartItems } = useUserCart(user?._id);

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
        <Link to="/">Studios</Link>
      </h1>
      <CartItemsList cartItems={cartItems || filteredItems} isDropdown={true} />
      <Navbar />
    </header>
  );
};

export default header;
