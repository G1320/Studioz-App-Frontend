const AUTH_RETURN_TO_KEY = 'authReturnTo';
export const PENDING_PROJECT_INVITE_TOKEN_KEY = 'pendingProjectInviteToken';
const PENDING_INVITE_NAVIGATED_KEY = 'pendingProjectInviteNavigated';

/** Only same-origin relative paths (block open redirects). */
export function isSafeInternalPath(path: unknown): path is string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}

/** Persist where to go after Auth0 redirect/login completes. */
export function setAuthReturnTo(path: string): void {
  if (isSafeInternalPath(path)) {
    sessionStorage.setItem(AUTH_RETURN_TO_KEY, path);
  }
}

export function clearPendingProjectInvite(): void {
  sessionStorage.removeItem(PENDING_PROJECT_INVITE_TOKEN_KEY);
  sessionStorage.removeItem(PENDING_INVITE_NAVIGATED_KEY);
}

/**
 * One-shot destination after auth. Prefers explicit returnTo, then pending invite.
 * Invite token itself is cleared only after accept succeeds.
 */
export function consumePostAuthReturnTo(lang: string): string | null {
  const stored = sessionStorage.getItem(AUTH_RETURN_TO_KEY);
  sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  if (isSafeInternalPath(stored)) {
    return stored;
  }

  const inviteToken = sessionStorage.getItem(PENDING_PROJECT_INVITE_TOKEN_KEY);
  if (!inviteToken) return null;

  // Avoid repeat navigations while the invite token stays until accept
  if (sessionStorage.getItem(PENDING_INVITE_NAVIGATED_KEY) === inviteToken) {
    return null;
  }
  sessionStorage.setItem(PENDING_INVITE_NAVIGATED_KEY, inviteToken);
  return `/${lang}/projects/invites/${inviteToken}`;
}
