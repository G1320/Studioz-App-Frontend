import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@components/common/buttons';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@services/index';
import { useUserContext, useOfflineCartContext } from '@contexts/index';
import { useErrorHandling } from '@hooks/index';
import { User } from '@models/index';

export const LoginButton = () => {
  const { user, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext } = useUserContext();
  const { offlineCart, setOfflineCartContext } = useOfflineCartContext();
  // const addItemsToCartMutation = useAddItemsToCartMutation();
  const handleError = useErrorHandling();

  const handleClick = async () => {
    loginWithPopup();
  };

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user) {
        const { name = '', sub, nickname: username = '', picture } = user;
        if (!sub) throw new Error('User sub is undefined');

        try {
          let loggedInUser: User;
          // Check if the user already exists in the DB
          const dbUser = await getUserBySub(sub);
          if (!dbUser) {
            // Register a new user if not found in the DB
            loggedInUser = await register({ name, sub, picture, username });
          } else {
            // Login the existing user
            loggedInUser = await login({ sub });
          }
          setLocalUser(loggedInUser);
          setUserContext(loggedInUser);

          // If there are items in the offline cart, add them to the user's cart
          if (offlineCart.items?.length > 0) {
            // addItemsToCartMutation.mutate(offlineCartContext);
            setOfflineCartContext({ items: [] });
            setLocalOfflineCart({ items: [] });
          }
        } catch (error) {
          handleError(error);
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user, handleError, offlineCart, setOfflineCartContext, setUserContext]);

  return (
    <Button onClick={handleClick} className="button login button">
      Sign in
    </Button>
  );
};
