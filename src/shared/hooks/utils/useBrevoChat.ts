import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadBrevoWidget } from '@shared/utils/brevoWidget';
import { featureFlags } from '@core/config/featureFlags';
import { useCookieConsent } from '@core/contexts';

/**
 * Hook to conditionally load the Brevo chat widget
 * Only loads on create, edit, and subscription pages when feature flag is enabled
 * and functional cookie consent is granted
 */
export const useBrevoChat = (): void => {
  const { pathname } = useLocation();
  const { hasCategory } = useCookieConsent();

  useEffect(() => {
    if (!featureFlags.brevoChat) return;
    if (!hasCategory('functional')) return;

    const shouldLoadChat =
      pathname.includes('/create') ||
      pathname.includes('/edit') ||
      pathname.includes('/subscriptions');

    if (shouldLoadChat) {
      loadBrevoWidget();
    }
  }, [pathname, hasCategory]);
};
