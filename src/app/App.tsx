import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, ReactNode, lazy, Suspense } from 'react';
import { useOfflineCartContext, useUserContext } from '@core/contexts';
import { useItems, useStudios, useCart, useBrevoChat } from '@shared/hooks';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@core/config';
import { HelmetProvider } from 'react-helmet-async';
import { Header, ResponsiveFooter } from '@app/layout';
import { ScrollToTop } from '@shared/utility-components';
import { shuffleArray } from '@shared/utils';
import { SEOTags } from '@shared/utility-components/SEOTags';
import { ErrorBoundary } from '@shared/utility-components/ErrorBoundary';
import { CookieConsentBanner } from '@shared/components/cookie-consent/CookieConsentBanner';
import { CookiePreferencesModal } from '@shared/components/cookie-consent/CookiePreferencesModal';
import { RouteAnnouncer } from '@shared/utility-components/RouteAnnouncer';
import AnimatedRoutes from './routes/AnimatedRoutes';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import 'dayjs/locale/he';
import 'dayjs/locale/en';

// Lazy-load Toaster — toast styles only needed when a toast fires
const LazyToaster = lazy(() => import('@shared/components/toast/StudiOzToaster'));

// Lazy-load Accessibility popover — not needed for initial render
const LazyAccessibilityPopover = lazy(
  () => import('@shared/components/accessibility/AccessibilityPopover')
);

// Feature flag to disable PayPal SDK loading (saves ~93 KiB)
const ENABLE_PAYPAL = import.meta.env.VITE_ENABLE_PAYPAL === 'true';

// Conditional wrapper - only loads PayPal SDK when enabled
const PayPalWrapper = ({ children }: { children: ReactNode }) => {
  if (!ENABLE_PAYPAL) return <>{children}</>;
  return <PayPalScriptProvider options={initialOptions}>{children}</PayPalScriptProvider>;
};

function App() {
  const location = useLocation();

  const { user } = useUserContext();
  const { offlineCart } = useOfflineCartContext();

  // Load Brevo chat widget on create, edit, and subscription pages
  useBrevoChat();

  const { data: onlineCart } = useCart(user?._id || '');
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const items = useMemo(() => shuffleArray(originalItems || []), [originalItems]);
  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);

  const { t } = useTranslation('common');

  useEffect(() => {
    try {
      const key = 'stale-asset-retry';
      const timestamp = sessionStorage.getItem(key);
      if (timestamp && Date.now() - Number(timestamp) < 10_000) {
        sessionStorage.removeItem(key);
        toast.info(t('toasts.info.appUpdated'));
      }
    } catch { /* sessionStorage may be unavailable */ }
  }, []);

  return (
    <HelmetProvider>
      <PayPalWrapper>
        <Header cart={onlineCart || offlineCart} user={user} />
        <SEOTags path={location.pathname} search={location.search} />

        <main className="main-content" id="main-content">
          <RouteAnnouncer />
          <ScrollToTop />
          <ErrorBoundary>
            <AnimatedRoutes
              studios={studios}
              items={items}
              onlineCart={onlineCart}
              offlineCart={offlineCart}
              user={user || undefined}
            />
          </ErrorBoundary>
        </main>

        <ResponsiveFooter />
        <CookieConsentBanner />
        <CookiePreferencesModal />
        <Suspense fallback={null}>
          <LazyAccessibilityPopover />
        </Suspense>
        <Suspense fallback={null}>
          <LazyToaster />
        </Suspense>
      </PayPalWrapper>
    </HelmetProvider>
  );
}

export default App;
