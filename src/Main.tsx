import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Auth0Provider } from '@auth0/auth0-react';

import { SocketProvider, SearchProvider, OfflineCartProvider, UserProvider, ModalProvider } from '@core/contexts';
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
        <UserProvider>
          <OfflineCartProvider>
            <SocketProvider>
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
                  <SearchProvider>
                    <App />
                  </SearchProvider>
                </ModalProvider>
              </Auth0Provider>
            </SocketProvider>
          </OfflineCartProvider>
        </UserProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
