import { useEffect, useCallback, useRef } from 'react';
import { featureFlags } from '@core/config/featureFlags';
import { loadBrevoWidget, openBrevoChat } from '@shared/utils/brevoWidget';

interface UseBrevoReturn {
  openChat: () => void;
}

// Delay before preloading Brevo (doesn't block initial page load)
const PRELOAD_DELAY_MS = 5000;

/**
 * Hook for Brevo chat functionality
 * Preloads the widget after a delay and provides a function to open the chat
 * 
 * @example
 * const { openChat } = useBrevoChat();
 * <button onClick={openChat}>Chat with us</button>
 */
export const useBrevoChat = (): UseBrevoReturn => {
  const preloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload the widget after a delay (doesn't impact initial page load)
  useEffect(() => {
    if (!featureFlags.brevoChat) return;

    preloadTimerRef.current = setTimeout(() => {
      loadBrevoWidget();
    }, PRELOAD_DELAY_MS);

    return () => {
      if (preloadTimerRef.current) {
        clearTimeout(preloadTimerRef.current);
      }
    };
  }, []);

  const openChat = useCallback(() => {
    if (!featureFlags.brevoChat) {
      console.warn('Brevo chat is disabled via feature flag');
      return;
    }
    // Cancel preload timer if user clicks before it fires
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
    }
    // Opens immediately (will load widget if not already loaded)
    openBrevoChat();
  }, []);

  return { openChat };
};
