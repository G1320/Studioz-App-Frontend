const AUTH_RETURN_TO_KEY = 'authReturnTo';
export const PENDING_PROJECT_INVITE_TOKEN_KEY = 'pendingProjectInviteToken';
const PENDING_INVITE_NAVIGATED_KEY = 'pendingProjectInviteNavigated';

function storage(): Storage | null {
  try {
    // localStorage survives Auth0 full-page redirects more reliably than sessionStorage
    // when www / apex hosts or browser privacy modes are involved.
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Only same-origin relative paths (block open redirects). */
export function isSafeInternalPath(path: unknown): path is string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}

/** Persist where to go after Auth0 redirect/login completes. */
export function setAuthReturnTo(path: string): void {
  const store = storage();
  if (store && isSafeInternalPath(path)) {
    store.setItem(AUTH_RETURN_TO_KEY, path);
  }
}

/** Read return path without consuming (Auth0 callback may navigate first). */
export function peekAuthReturnTo(): string | null {
  try {
    const stored = storage()?.getItem(AUTH_RETURN_TO_KEY);
    return isSafeInternalPath(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function setPendingProjectInviteToken(token: string): void {
  storage()?.setItem(PENDING_PROJECT_INVITE_TOKEN_KEY, token);
}

export function getPendingProjectInviteToken(): string | null {
  try {
    return storage()?.getItem(PENDING_PROJECT_INVITE_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
}

export function clearPendingProjectInvite(): void {
  const store = storage();
  store?.removeItem(PENDING_PROJECT_INVITE_TOKEN_KEY);
  store?.removeItem(PENDING_INVITE_NAVIGATED_KEY);
  store?.removeItem(AUTH_RETURN_TO_KEY);
}

/**
 * One-shot destination after auth. Prefers explicit returnTo, then pending invite.
 * Invite token itself is cleared only after accept succeeds.
 */
export function consumePostAuthReturnTo(lang: string): string | null {
  const store = storage();
  if (!store) return null;

  const stored = store.getItem(AUTH_RETURN_TO_KEY);
  store.removeItem(AUTH_RETURN_TO_KEY);
  if (isSafeInternalPath(stored)) {
    return stored;
  }

  const inviteToken = store.getItem(PENDING_PROJECT_INVITE_TOKEN_KEY);
  if (!inviteToken) return null;

  // Avoid repeat navigations while the invite token stays until accept
  if (store.getItem(PENDING_INVITE_NAVIGATED_KEY) === inviteToken) {
    return null;
  }
  store.setItem(PENDING_INVITE_NAVIGATED_KEY, inviteToken);
  return `/${lang}/projects/invites/${inviteToken}`;
}
