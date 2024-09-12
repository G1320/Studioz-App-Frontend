import { ReactElement, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../common/index';
import { setLocalUser } from '../../services/user-service';
import { getUserBySub } from '../../services/user-service';
import { register, login } from '../../services/auth-service';

import { useUserContext } from '../../contexts/UserContext';
import { useOfflineCartContext } from '../../contexts/OfflineCartContext';
import { useAddItemsToCartMutation } from '../../hooks/index';
import { setLocalOfflineCart } from '../../services/cart-service';

const LoginButton: React.FC = (): ReactElement | null => {
  const { user, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext } = useUserContext();
  const { offlineCartContext, setOfflineCartContext } = useOfflineCartContext();
  const addItemsToCartMutation = useAddItemsToCartMutation();

  const handleClick = async () => {
    loginWithPopup();
  };

  useEffect(() => {
    const handleUserLogin = async () => {
      if (isAuthenticated && user) {
        const { name = '', sub, nickname: username = '', picture } = user;
        if (!sub) {
          throw new Error('User sub is undefined');
        }
        try {
          const dbUser = await getUserBySub(sub);
          if (!dbUser) {
            const loggedInUser = await register({
              name,
              sub,
              picture,
              username,
            });
            setLocalUser(loggedInUser);
            setUserContext(loggedInUser);
          } else {
            const loggedInUser = await login({ sub });
            setLocalUser(loggedInUser);
            setUserContext(loggedInUser);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            if ((error as any).code === 11000 && (error as any).keyPattern && (error as any).keyValue) {
              console.error(`User with username '${(error as any).keyValue.username}' already exists.`);
            } else {
              console.error('Error during login or registration:', error.message);
            }
          } else {
            console.error('Unknown error occurred:', error);
          }
        } finally {
          if (offlineCartContext.items?.length > 0) {
            addItemsToCartMutation.mutate(offlineCartContext);
            setOfflineCartContext({ items: []}) ;
            setLocalOfflineCart({ items: [] });
          }
        }
      }
    };

    handleUserLogin();
  }, [isAuthenticated, user]);

  return (
    !isAuthenticated ? (
      <Button onClick={handleClick} className="button login button">
        Sign in
      </Button>
    ) : null
  );
};

export default LoginButton;
