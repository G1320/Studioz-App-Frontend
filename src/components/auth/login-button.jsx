import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../common/buttons/genericButton';
import { setLocalUser } from '../../services/user-service';
import { getUserBySub } from '../../services/user-service';
import { register, login } from '../../services/auth-service';

import { useUserContext } from '../../contexts/UserContext';
import { useOfflineCartContext } from '../../contexts/OfflineCartContext';
import { useAddItemsToCartMutation } from '../../hooks/mutations/cart/cartMutations';
import { setLocalOfflineCart } from '../../services/cart-service';

const loginButton = () => {
  const { user, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setContextUser } = useUserContext();
  const { offlineCart, setOfflineCart } = useOfflineCartContext();
  const addItemsToCartMutation = useAddItemsToCartMutation();

  const handleClick = async (e) => {
    loginWithPopup();
  };

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user) {
        const { name, sub, nickname: username, picture } = user;
        try {
          const dbUser = await getUserBySub(sub);
          if (!dbUser) {
            const loggedInUserObj = await register({
              name,
              sub,
              picture,
              username,
            });
            setLocalUser(loggedInUserObj.user);
            setContextUser(loggedInUserObj.user);
          } else {
            const loggedInUser = await login({ sub: user.sub });
            setLocalUser(loggedInUser);
            setContextUser(loggedInUser);
          }
        } catch (error) {
          if (error.code === 11000 && error.keyPattern && error.keyValue) {
            console.error(`User with username '${error.keyValue.username}' already exists.`);
          } else {
            console.error('Error during login or registration:', error);
            console.log('Duplicate Registration attempt detected');
          }
        } finally {
          if (offlineCart.length > 0) {
            addItemsToCartMutation.mutate(offlineCart);
            setOfflineCart([]);
            setLocalOfflineCart([]);
          }
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user]);

  return (
    !isAuthenticated && (
      <Button onClick={handleClick} className="button login button">
        Sign in
      </Button>
    )
  );
};

export default loginButton;
