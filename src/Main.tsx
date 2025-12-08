import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Auth0Provider } from '@auth0/auth0-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import i18n from './core/i18n/config';
import {
  SocketProvider,
  SearchProvider,
  OfflineCartProvider,
  UserProvider,
  ModalProvider,
  ReservationModalProvider,
  CookieConsentProvider,
  LocationPermissionProvider,
  NotificationProvider
} from '@core/contexts';
import './core/i18n/config';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

import App from './app/App.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
});

const persister = createSyncStoragePersister({ storage: window.localStorage });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <Router>
        <CookieConsentProvider>
          <LocationPermissionProvider>
            <UserProvider>
              <OfflineCartProvider>
                <SocketProvider>
                  <NotificationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
                      <Auth0Provider
                        domain={domain}
                        clientId={clientId}
                        authorizationParams={{
                          redirect_uri: window.location.origin,
                          audience: 'https://items-app-backend.onrender.com',
                          scope: 'openid profile email'
                        }}
                      >
                        <ModalProvider>
                          <ReservationModalProvider>
                            <SearchProvider>
                              <App />
                            </SearchProvider>
                          </ReservationModalProvider>
                        </ModalProvider>
                      </Auth0Provider>
                    </LocalizationProvider>
                  </NotificationProvider>
                </SocketProvider>
              </OfflineCartProvider>
            </UserProvider>
          </LocationPermissionProvider>
        </CookieConsentProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
