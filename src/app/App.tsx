import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@core/contexts';
import { useItems, useStudios, useCart } from '@shared/hooks';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@core/config';
import { HelmetProvider } from 'react-helmet-async';

import { Header, ResponsiveFooter } from '@app/layout';
import { ScrollToTop } from '@shared/utility-components';

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

  const { data: onlineCart } = useCart(user?._id || '');
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const items = useMemo(() => shuffleArray(originalItems || []), [originalItems]);
  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);

  return (
    <HelmetProvider>
      <PayPalScriptProvider options={initialOptions}>
        <Header cart={onlineCart || offlineCart} user={user} />
        <SEOTags path={location.pathname} />

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
        <Toaster
          richColors
          toastOptions={{
            style: {
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#333',
              border: 'none',
              color: '#fff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: '0.875rem'
            },
            className: 'toast'
          }}
        />
      </PayPalScriptProvider>
    </HelmetProvider>
  );
}

export default App;
