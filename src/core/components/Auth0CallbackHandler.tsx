import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setLocalUser, setLocalOfflineCart, getUserBySub, register, login } from '@shared/services';
import { useUserContext, useOfflineCartContext } from '@core/contexts';
import { useErrorHandling } from '@shared/hooks';
import { User } from 'src/types/index';
import i18n from '@core/i18n/config';

/**
 * Global component to handle Auth0 authentication callbacks
 * This ensures users are logged in after email verification redirects
 */
export const Auth0CallbackHandler = () => {
  const { user, isAuthenticated, isLoading, handleRedirectCallback } = useAuth0();
  const { setUser: setUserContext, user: currentUser } = useUserContext();
  const { offlineCart, setOfflineCartContext } = useOfflineCartContext();
  const handleError = useErrorHandling();
  const navigate = useNavigate();
  const location = useLocation();
  const processedSubRef = useRef<string | null>(null);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  // Handle redirect callback first
  useEffect(() => {
    const processRedirectCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const hasCode = searchParams.has('code');
      const hasState = searchParams.has('state');

      // If we have callback parameters, handle the redirect callback
      if ((hasCode && hasState) && !isProcessingCallback && handleRedirectCallback) {
        setIsProcessingCallback(true);
        try {
          const result = await handleRedirectCallback();
          // Clear the URL parameters after processing
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          console.log('Auth0 redirect callback processed successfully', result);
        } catch (error) {
          console.error('Error processing Auth0 redirect callback:', error);
          handleError(error);
          setIsProcessingCallback(false);
        }
      }
    };

    processRedirectCallback();
  }, [location.search, handleRedirectCallback, handleError, isProcessingCallback]);

  useEffect(() => {
    const handleAuth0Callback = async () => {
      // Wait for Auth0 to finish loading and processing the callback
      if (isLoading || isProcessingCallback) {
        return;
      }

      // Only process if Auth0 says we're authenticated and we have user data
      // Also check if we haven't already processed this user (avoid duplicate processing)
      if (isAuthenticated && user && !isLoading) {
        const { name = '', sub, nickname: username = '', picture, email = '', email_verified = false } = user;
        
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
          setIsProcessingCallback(false);
          return;
        }

        try {
          let loggedInUser: User;
          
          // Check if the user already exists in the DB
          const dbUser = await getUserBySub(sub);
          
          if (!dbUser) {
            // Register a new user if not found in the DB
            loggedInUser = await register({ 
              name, 
              sub, 
              picture, 
              username, 
              email, 
              email_verified 
            });
          } else {
            // Login the existing user
            loggedInUser = await login({ sub });
          }
          
          setLocalUser(loggedInUser);
          setUserContext(loggedInUser);
          processedSubRef.current = sub;
          setIsProcessingCallback(false);

          // If there are items in the offline cart, add them to the user's cart
          if (offlineCart.items?.length > 0) {
            setOfflineCartContext({ items: [] });
            setLocalOfflineCart({ items: [] });
          }

          // If we're on the root path (likely after email verification redirect), navigate to profile
          if (window.location.pathname === '/' || window.location.pathname === '') {
            navigate(`/${i18n.language}/profile`, { replace: true });
          }
        } catch (error) {
          console.error('Error handling Auth0 callback:', error);
          handleError(error);
          setIsProcessingCallback(false);
        }
      }
    };

    handleAuth0Callback();
  }, [isAuthenticated, user, isLoading, isProcessingCallback, currentUser, setUserContext, offlineCart, setOfflineCartContext, handleError, navigate]);

  // Show loading state while processing callback
  if (isLoading || isProcessingCallback) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#fff',
        zIndex: 9999
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // This component doesn't render anything when not loading
  return null;
};

