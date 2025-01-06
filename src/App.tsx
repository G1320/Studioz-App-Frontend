import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@contexts/index';
import { useItems, useStudios, useOnlineCart } from '@hooks/index';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@config/paypal/paypalConfig';
import { HelmetProvider } from 'react-helmet-async';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Header, ResponsiveFooter, ScrollToTop } from '@components/index';

import { shuffleArray } from '@utils/index';
import { SEOTags } from '@components/utility/SEOTags';
import { ErrorBoundary } from '@components/utility/ErrorBoundary';
import AnimatedRoutes from './routes/AnimatedRoutes';

function App() {
  const customLocaleText = {
    okButtonLabel: 'Confirm Booking',
    cancelButtonLabel: 'Cancel'
  };
  const location = useLocation();

  const { user } = useUserContext();
  const { offlineCart } = useOfflineCartContext();

  const { data: onlineCart } = useOnlineCart(user?._id || '');
  const { data: originalItems } = useItems();
  const { data: originalStudios } = useStudios();

  const items = useMemo(() => shuffleArray(originalItems || []), [originalItems]);
  const studios = useMemo(() => shuffleArray(originalStudios || []), [originalStudios]);

  return (
    <HelmetProvider>
      <PayPalScriptProvider options={initialOptions}>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={customLocaleText}>
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
        </LocalizationProvider>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
}

export default App;
