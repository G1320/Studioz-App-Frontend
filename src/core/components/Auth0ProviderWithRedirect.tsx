import { Auth0Provider, AppState } from '@auth0/auth0-react';
import i18n from '@core/i18n/config';
import {
  getPendingProjectInviteToken,
  isSafeInternalPath,
  peekAuthReturnTo,
  setAuthReturnTo
} from '@shared/utils/authReturnTo';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

function resolvePostLoginPath(appState?: AppState): string | null {
  if (isSafeInternalPath(appState?.returnTo)) {
    return appState.returnTo as string;
  }

  const stored = peekAuthReturnTo();
  if (stored) return stored;

  const inviteToken = getPendingProjectInviteToken();
  if (inviteToken) {
    return `/${i18n.language}/projects/invites/${inviteToken}`;
  }

  return null;
}

/**
 * Auth0Provider that returns users to the page they logged in from.
 * Uses a full navigation (location.replace) because React Router navigate()
 * during Auth0's redirect callback is unreliable and often leaves users on `/`.
 */
export function Auth0ProviderWithRedirect({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://items-app-backend.onrender.com',
        scope: 'openid profile email'
      }}
      onRedirectCallback={(appState) => {
        const dest = resolvePostLoginPath(appState);
        if (dest) {
          setAuthReturnTo(dest);
          const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          if (dest !== current && dest !== window.location.pathname) {
            window.location.replace(dest);
            return;
          }
        }
        // Strip Auth0 ?code=&state= when staying put
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      {children}
    </Auth0Provider>
  );
}
