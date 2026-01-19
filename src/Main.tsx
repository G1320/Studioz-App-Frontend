import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';

import { BrowserRouter as Router } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Auth0Provider } from '@auth0/auth0-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import i18n from './core/i18n/config';
import { queryClient } from './core/config/queryClient';
import { persistOptions } from './core/config/persistenceOptions';
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
import { ThemeProvider } from '@shared/contexts/ThemeContext';
import './core/i18n/config';

// Initialize Sentry for error tracking (production only)
if (import.meta.env.VITE_NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://9aae340b19784f7ebb4ef1a2e1a10bee@o4510709493071872.ingest.de.sentry.io/4510709534883920',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({
        // Customize the feedback widget
        colorScheme: 'system',
        isNameRequired: false,
        isEmailRequired: false,
        showBranding: false,
        buttonLabel: 'דווח על בעיה',
        submitButtonLabel: 'שלח',
        cancelButtonLabel: 'ביטול',
        formTitle: 'דווח על בעיה',
        nameLabel: 'שם',
        namePlaceholder: 'השם שלך',
        emailLabel: 'אימייל',
        emailPlaceholder: 'your@email.com',
        messageLabel: 'תיאור הבעיה',
        messagePlaceholder: 'מה קרה? מה ציפית שיקרה?',
        successMessageText: 'תודה על המשוב!'
      })
    ],

    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    // Send default PII data
    sendDefaultPii: true,
    // Environment
    environment: 'production'
  });
}

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

import App from './app/App.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
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
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </PersistQueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
