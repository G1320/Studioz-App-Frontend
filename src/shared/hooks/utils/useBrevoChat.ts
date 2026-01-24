import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadBrevoWidget } from '@shared/utils/brevoWidget';
import { featureFlags } from '@core/config/featureFlags';

/**
 * Hook to conditionally load the Brevo chat widget
 * Only loads on create, edit, and subscription pages when feature flag is enabled
 */
export const useBrevoChat = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check feature flag first
    if (!featureFlags.brevoChat) {
      return;
    }

    const shouldLoadChat =
      pathname.includes('/create') ||
      pathname.includes('/edit') ||
      pathname.includes('/subscriptions');

    if (shouldLoadChat) {
      loadBrevoWidget();
    }
  }, [pathname]);
};
