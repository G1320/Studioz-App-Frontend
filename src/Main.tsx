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
      staleTime: 5 * 60 * 1000, // 5 minutes default (not 24h - too long!)
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
      retry: 2,
      refetchOnWindowFocus: false // Don't refetch on tab focus
    }
  }
});

// Selective persistence - persist critical data with appropriate TTL
// Studios/Items: Persisted with 2h TTL for instant load, but refresh for freshness
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  serialize: JSON.stringify,
  deserialize: JSON.parse
});

// Configure which queries to persist
const persistOptions = {
  persister,
  maxAge: 1000 * 60 * 60 * 2, // 2 hours max age (studios/items refresh after 2h for freshness)
  // Only persist specific query keys
  dehydrateOptions: {
    shouldDehydrateQuery: (query: any) => {
      const queryKey = query.queryKey[0];

      // ✅ PERSIST: User-specific, small, rarely changes
      const persistableKeys = ['user', 'cart', 'wishlists', 'wishlistItems'];

      // ✅ PERSIST: Individual studio/item details (smaller, less frequent changes)
      // But only if they're individual queries, not arrays
      if (queryKey === 'studio' && query.queryKey.length === 2) {
        return true; // Individual studio: ['studio', studioId]
      }
      if (queryKey === 'item' && query.queryKey.length === 2) {
        return true; // Individual item: ['item', itemId]
      }

      // ⚠️ PERSIST WITH SHORT TTL: Studios/Items arrays (for instant load on refresh)
      // We persist these but with shorter maxAge (1-2 hours) to balance performance vs freshness
      if (queryKey === 'studios' && query.queryKey.length <= 2) {
        return true; // Persist studios array: ['studios'] or ['studios', {}]
      }
      if (queryKey === 'items' && query.queryKey.length <= 2) {
        return true; // Persist items array: ['items'] or ['items', {}]
      }

      // ❌ DON'T PERSIST: Data that changes very frequently
      const nonPersistableKeys = ['reservations', 'reservationsList', 'notifications', 'notificationCount', 'search'];

      // Check if it's a persistable key
      if (persistableKeys.includes(queryKey as string)) {
        return true;
      }

      // Check if it's a non-persistable key
      if (nonPersistableKeys.includes(queryKey as string)) {
        return false;
      }

      // Default: don't persist unknown queries (safer)
      return false;
    }
  }
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
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
