import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@shared/services';
import { useUserContext, useOfflineCartContext } from '@core/contexts';
import { useErrorHandling } from '@shared/hooks';
import { User } from 'src/types/index';

/**
 * Hook to handle Auth0 login flow and update user context
 * Automatically processes login when user becomes authenticated
 * 
 * @returns Object containing loginWithPopup function and loading state
 */
export const useAuth0LoginHandler = () => {
  const { user: auth0User, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext } = useUserContext();
  const { offlineCart, setOfflineCartContext } = useOfflineCartContext();
  const handleError = useErrorHandling();

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && auth0User) {
        const { name = '', sub, nickname: username = '', picture, email = '', email_verified = false } = auth0User;
        if (!sub) throw new Error('User sub is undefined');

        try {
          let loggedInUser: User;
          // Check if the user already exists in the DB
          const dbUser = await getUserBySub(sub);
          if (!dbUser) {
            // Register a new user if not found in the DB
            loggedInUser = await register({ name, sub, picture, username, email, email_verified });
          } else {
            // Login the existing user
            loggedInUser = await login({ sub });
          }
          setLocalUser(loggedInUser);
          setUserContext(loggedInUser);

          // If there are items in the offline cart, add them to the user's cart
          if (offlineCart.items?.length > 0) {
            setOfflineCartContext({ items: [] });
            setLocalOfflineCart({ items: [] });
          }
        } catch (error) {
          handleError(error);
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, auth0User, handleError, offlineCart, setOfflineCartContext, setUserContext]);

  return {
    loginWithPopup,
    isAuthenticated
  };
};

