import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@shared/services';
import { useUserContext, useOfflineCartContext } from '@core/contexts';
import { useErrorHandling } from '@shared/hooks';
import { User } from 'src/types/index';
import { useTranslation } from 'react-i18next';

export const LoginButton = () => {
  const { user, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext } = useUserContext();
  const { offlineCart, setOfflineCartContext } = useOfflineCartContext();
  // const addItemsToCartMutation = useAddItemsToCartMutation();
  const handleError = useErrorHandling();
  const { t } = useTranslation('common');

  const handleClick = async () => {
    loginWithPopup();
  };

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user) {
        const { name = '', sub, nickname: username = '', picture, email = '', email_verified = false } = user;
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
    <div role="button" onClick={handleClick} className="button login-button">
      {t('buttons.log_in')}
    </div>
  );
};
