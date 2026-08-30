import { useCallback, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@shared/services';
import { useUserContext, useOfflineCartContext } from '@core/contexts';
import { useErrorHandling } from '@shared/hooks';
import { User } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks/utils';
import i18n from '@core/i18n/config';
import {
  consumePostAuthReturnTo,
  isSafeInternalPath,
  setAuthReturnTo
} from '@shared/utils/authReturnTo';

function currentAppPath(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function isHomePath(path: string): boolean {
  const pathname = path.split(/[?#]/)[0] || '/';
  return pathname === '/' || pathname === `/${i18n.language}` || pathname === `/${i18n.language}/`;
}

/**
 * Hook to handle Auth0 login flow and update user context
 * Automatically processes login when user becomes authenticated
 *
 * @returns Object containing loginWithPopup function and loading state
 */
export const useAuth0LoginHandler = () => {
  const { user: auth0User, loginWithPopup: auth0LoginWithPopup, isAuthenticated } = useAuth0();
  const { setUser: setUserContext, user: currentUser } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const navigate = useNavigate();
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

  const navigateAfterAuth = () => {
    const dest = consumePostAuthReturnTo(i18n.language);
    if (dest) {
      // Already on that page (popup login) — no navigation needed
      if (dest === currentAppPath() || dest === window.location.pathname) {
        return true;
      }
      navigate(dest, { replace: true });
      return true;
    }
    return false;
  };

  /** Remember current page so post-login does not dump users on home/profile. */
  const loginWithPopup = useCallback(
    async (...args: Parameters<typeof auth0LoginWithPopup>) => {
      const path = currentAppPath();
      if (isSafeInternalPath(path.split(/[?#]/)[0] || path)) {
        setAuthReturnTo(path);
      }
      return auth0LoginWithPopup(...args);
    },
    [auth0LoginWithPopup]
  );

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

      // Skip if we've already processed this sub (still honor a pending returnTo once)
      if (processedSubRef.current === sub) {
        navigateAfterAuth();
        return;
      }

      // Skip if this user is already logged in locally with the same sub
      if (currentUser?.sub === sub) {
        processedSubRef.current = sub;
        navigateAfterAuth();
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

        if (navigateAfterAuth()) {
          return;
        }

        // Only send to profile/dashboard when logging in from home / unknown entry
        if (isHomePath(window.location.pathname)) {
          const hasStudios = Boolean(loggedInUser.studios?.length);
          langNavigate(hasStudios ? '/dashboard' : '/profile');
        }
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
    navigate,
    setOfflineCartContext,
    setUserContext
  ]);

  return {
    loginWithPopup,
    isAuthenticated
  };
};
