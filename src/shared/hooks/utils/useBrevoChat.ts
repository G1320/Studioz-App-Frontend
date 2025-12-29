import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadBrevoWidget } from '@shared/utils/brevoWidget';

/**
 * Hook to conditionally load the Brevo chat widget
 * Only loads on create, edit, and subscription pages
 */
export const useBrevoChat = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldLoadChat =
      pathname.includes('/create') ||
      pathname.includes('/edit') ||
      pathname.includes('/subscriptions');

    if (shouldLoadChat) {
      loadBrevoWidget();
    }
  }, [pathname]);
};
