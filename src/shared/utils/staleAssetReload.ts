const RETRY_KEY = 'stale-asset-retry';
const COOLDOWN_MS = 10_000;

/**
 * Detects whether an error is caused by a stale asset (JS chunk or CSS)
 * that no longer exists on the server after a new deployment.
 */
export function isStaleAssetError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message ?? '';
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk') ||
    msg.includes('Loading CSS chunk') ||
    msg.includes('Unable to preload CSS') ||
    (error as { name?: string }).name === 'ChunkLoadError'
  );
}

/**
 * Performs a single page reload to pick up fresh assets from the latest
 * deployment.  Guards against infinite reload loops by recording the
 * timestamp in sessionStorage and refusing to reload again within
 * `COOLDOWN_MS` (10 s).
 *
 * @returns `true` if a reload was triggered, `false` if suppressed.
 */
export function reloadOnStaleAsset(): boolean {
  try {
    const lastRetry = sessionStorage.getItem(RETRY_KEY);
    const now = Date.now();

    if (lastRetry && now - Number(lastRetry) < COOLDOWN_MS) {
      return false;
    }

    sessionStorage.setItem(RETRY_KEY, String(now));
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}
