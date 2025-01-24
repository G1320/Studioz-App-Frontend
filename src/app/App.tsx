import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useOfflineCartContext, useUserContext } from '@core/contexts';
import { useItems, useStudios, useOnlineCart } from '@shared/hooks';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from '@core/config';
import { HelmetProvider } from 'react-helmet-async';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Header, ResponsiveFooter } from '@app/layout';
import { ScrollToTop } from '@components/index';

import { shuffleArray } from '@shared/utils';
import { SEOTags } from '@components/utility/SEOTags';
import { ErrorBoundary } from '@components/utility/ErrorBoundary';
import AnimatedRoutes from './routes/AnimatedRoutes';
import { useTranslation } from 'react-i18next';

import 'dayjs/locale/he';
import 'dayjs/locale/en';

function App() {
  const { i18n } = useTranslation();

  const customLocaleText = useMemo(
    () => ({
      okButtonLabel: i18n.language === 'he' ? 'אישור הזמנה' : 'Confirm Booking',
      cancelButtonLabel: i18n.language === 'he' ? 'ביטול' : 'Cancel'
    }),
    [i18n.language]
  );
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
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={customLocaleText} adapterLocale={i18n.language}>
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
