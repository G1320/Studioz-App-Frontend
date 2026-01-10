import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@shared/services';
import { useUserContext, useOfflineCartContext } from '@core/contexts';
import { useErrorHandling } from '@shared/hooks';
import { User } from 'src/types/index';
import i18n from '@core/i18n/config';

/**
 * Hook to handle Auth0 login flow and update user context
 * Automatically processes login when user becomes authenticated
 * 
 * @returns Object containing loginWithPopup function and loading state
 */
export const useAuth0LoginHandler = () => {
  const { user: auth0User, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext, user: currentUser } = useUserContext();
  const { offlineCart, setOfflineCartContext } = useOfflineCartContext();
  const handleError = useErrorHandling();
  const navigate = useNavigate();
  const processedSubRef = useRef<string | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleUserLogin = async () => {
      // Prevent concurrent processing
      if (isProcessingRef.current) {
        return;
      }

      if (!isAuthenticated || !auth0User) {
        return;
      }

      const { name = '', sub, nickname: username = '', picture, email = '', email_verified = false } = auth0User;
      
      if (!sub) {
        console.error('Auth0 user sub is undefined');
        return;
      }

      // Skip if we've already processed this sub
      if (processedSubRef.current === sub) {
        return;
      }

      // Skip if this user is already logged in locally with the same sub
      if (currentUser?.sub === sub) {
        processedSubRef.current = sub;
        return;
      }

      // Mark as processing to prevent concurrent calls
      isProcessingRef.current = true;

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
        processedSubRef.current = sub;

        // If there are items in the offline cart, add them to the user's cart
        if (offlineCart.items?.length > 0) {
          setOfflineCartContext({ items: [] });
          setLocalOfflineCart({ items: [] });
        }

        // Navigate to profile after successful login
        navigate(`/${i18n.language}/profile`, { replace: true });
      } catch (error) {
        handleError(error);
        // Reset processed ref on error so we can retry
        processedSubRef.current = null;
      } finally {
        isProcessingRef.current = false;
      }
    };

    handleUserLogin();
  }, [isAuthenticated, auth0User?.sub, currentUser?.sub, handleError, offlineCart?.items?.length, setOfflineCartContext, setUserContext, navigate]);

  return {
    loginWithPopup,
    isAuthenticated
  };
};

