import { useLocation } from 'react-router-dom';
import { useMemo, useEffect, ReactNode } from 'react';
import { useOfflineCartContext, useUserContext } from '@core/contexts';
import { useItems, useStudios, useCart, useBrevoChat } from '@shared/hooks';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@core/config';
import { HelmetProvider } from 'react-helmet-async';

// Feature flag to disable PayPal SDK loading (saves ~93 KiB)
const ENABLE_PAYPAL = import.meta.env.VITE_ENABLE_PAYPAL === 'true';

// Conditional wrapper - only loads PayPal SDK when enabled
const PayPalWrapper = ({ children }: { children: ReactNode }) => {
  if (!ENABLE_PAYPAL) return <>{children}</>;
  return <PayPalScriptProvider options={initialOptions}>{children}</PayPalScriptProvider>;
};

import { Header, ResponsiveFooter } from '@app/layout';
import { ScrollToTop } from '@shared/utility-components';
import { CookieConsentBanner } from '@shared/components/cookie-consent';

import { shuffleArray } from '@shared/utils';
import { SEOTags } from '@shared/utility-components/SEOTags';
import { ErrorBoundary } from '@shared/utility-components/ErrorBoundary';
import AnimatedRoutes from './routes/AnimatedRoutes';

import 'dayjs/locale/he';
import 'dayjs/locale/en';

function App() {
  const location = useLocation();

  const { user } = useUserContext();
  const { offlineCart } = useOfflineCartContext();

  // Mark root as hydrated to remove CSS background placeholder
  useEffect(() => {
    document.getElementById('root')?.classList.add('hydrated');
  }, []);

  // Load Brevo chat widget on create, edit, and subscription pages
  useBrevoChat();

  const { data: onlineCart } = useCart(user?._id || '');
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const items = useMemo(() => shuffleArray(originalItems || []), [originalItems]);
  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);

  return (
    <HelmetProvider>
      <PayPalWrapper>
        <Header cart={onlineCart || offlineCart} user={user} />
        <SEOTags path={location.pathname} search={location.search} />

        <main className="main-content" id="main-content">
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
        <Toaster
          position="bottom-center"
          expand={false}
          richColors
          closeButton
          duration={5000}
          toastOptions={{
            className: 'studioz-toast'
          }}
        />
      </PayPalWrapper>
    </HelmetProvider>
  );
}

export default App;
