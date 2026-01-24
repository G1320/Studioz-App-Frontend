import { useEffect, useCallback } from 'react';
import { featureFlags } from '@core/config/featureFlags';
import { loadBrevoWidget, openBrevoChat } from '@shared/utils/brevoWidget';

interface UseBrevoReturn {
  openChat: () => void;
}

/**
 * Hook for Brevo chat functionality
 * Preloads the widget and provides a function to open the chat
 * 
 * @example
 * const { openChat } = useBrevoChat();
 * <button onClick={openChat}>Chat with us</button>
 */
export const useBrevoChat = (): UseBrevoReturn => {
  // Preload the widget on mount if feature is enabled
  useEffect(() => {
    if (featureFlags.brevoChat) {
      loadBrevoWidget();
    }
  }, []);

  const openChat = useCallback(() => {
    if (!featureFlags.brevoChat) {
      console.warn('Brevo chat is disabled via feature flag');
      return;
    }
    openBrevoChat();
  }, []);

  return { openChat };
};
