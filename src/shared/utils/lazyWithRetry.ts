import { lazy, ComponentType } from 'react';

/**
 * Wrapper around React.lazy that retries once on chunk load failure.
 *
 * After a deployment, old chunk URLs (with stale hashes) return 404.
 * This utility catches the import error, appends a cache-busting query
 * parameter, and retries once. If the retry also fails, the error
 * propagates to the nearest ErrorBoundary.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(() =>
    importFn().catch((error: Error) => {
      // Only retry on chunk/network errors, not on syntax errors
      const isChunkError =
        error.message?.includes('Failed to fetch dynamically imported module') ||
        error.message?.includes('Loading chunk') ||
        error.message?.includes('Loading CSS chunk') ||
        error.name === 'ChunkLoadError';

      if (!isChunkError) throw error;

      // Check if we already retried this session to prevent infinite loops
      const retryKey = 'chunk-retry';
      const lastRetry = sessionStorage.getItem(retryKey);
      const now = Date.now();

      if (lastRetry && now - Number(lastRetry) < 10_000) {
        // Already retried within the last 10 seconds — don't loop
        throw error;
      }

      sessionStorage.setItem(retryKey, String(now));

      // Full reload to get fresh HTML with new chunk URLs
      window.location.reload();

      // Return a never-resolving promise to prevent React from rendering
      // while the page is reloading
      return new Promise<{ default: T }>(() => {});
    })
  );
}
