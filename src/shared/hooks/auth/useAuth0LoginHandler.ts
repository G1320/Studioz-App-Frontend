import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@shared/services';
import { useUserContext, useOfflineCartContext } from '@core/contexts';
import { useErrorHandling } from '@shared/hooks';
import { User } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks/utils';

/**
 * Hook to handle Auth0 login flow and update user context
 * Automatically processes login when user becomes authenticated
 *
 * @returns Object containing loginWithPopup function and loading state
 */
export const useAuth0LoginHandler = () => {
  const { user: auth0User, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext, user: currentUser } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { offlineCart, setOfflineCartContext } = useOfflineCartContext();
  const handleError = useErrorHandling();
  const processedSubRef = useRef<string | null>(null);
  const isProcessingRef = useRef(false);

  const auth0Sub = auth0User?.sub;
  const auth0Name = auth0User?.name;
  const auth0Nickname = auth0User?.nickname;
  const auth0Picture = auth0User?.picture;
  const auth0Email = auth0User?.email;
  const auth0EmailVerified = auth0User?.email_verified;

  useEffect(() => {
    const handleUserLogin = async () => {
      // Prevent concurrent processing
      if (isProcessingRef.current) {
        return;
      }

      if (!isAuthenticated || !auth0Sub) {
        return;
      }

      const name = auth0Name || '';
      const sub = auth0Sub;
      const username = auth0Nickname || '';
      const picture = auth0Picture;
      const email = auth0Email || '';
      const email_verified = auth0EmailVerified || false;

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

        const hasStudios = Boolean(loggedInUser.studios?.length);
        langNavigate(hasStudios ? '/dashboard' : '/profile');
      } catch (error) {
        handleError(error);
        // Reset processed ref on error so we can retry
        processedSubRef.current = null;
      } finally {
        isProcessingRef.current = false;
      }
    };

    handleUserLogin();
  }, [
    isAuthenticated,
    auth0Sub,
    auth0Name,
    auth0Nickname,
    auth0Picture,
    auth0Email,
    auth0EmailVerified,
    currentUser?.sub,
    handleError,
    offlineCart?.items?.length,
    langNavigate,
    setOfflineCartContext,
    setUserContext
  ]);

  return {
    loginWithPopup,
    isAuthenticated
  };
};
