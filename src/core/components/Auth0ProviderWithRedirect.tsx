import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import i18n from '@core/i18n/config';
import {
  PENDING_PROJECT_INVITE_TOKEN_KEY,
  isSafeInternalPath,
  peekAuthReturnTo,
  setAuthReturnTo
} from '@shared/utils/authReturnTo';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

function resolvePostLoginPath(appState?: AppState): string | null {
  if (isSafeInternalPath(appState?.returnTo)) {
    return appState.returnTo;
  }

  const stored = peekAuthReturnTo();
  if (stored) return stored;

  try {
    const inviteToken = sessionStorage.getItem(PENDING_PROJECT_INVITE_TOKEN_KEY);
    if (inviteToken) {
      return `/${i18n.language}/projects/invites/${inviteToken}`;
    }
  } catch {
    /* sessionStorage may be unavailable */
  }

  return null;
}

/**
 * Auth0Provider that returns users to the page they logged in from
 * (invite links, item pages, etc.) instead of leaving them on `/`.
 */
export function Auth0ProviderWithRedirect({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

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
          navigate(dest, { replace: true });
          return;
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      {children}
    </Auth0Provider>
  );
}
