import { lazy, ComponentType } from 'react';
import { isStaleAssetError, reloadOnStaleAsset } from './staleAssetReload';

/**
 * Wrapper around React.lazy that reloads once on stale-asset failure.
 *
 * After a deployment, old chunk URLs (with stale hashes) return 404.
 * This utility catches the import error and triggers a single page
 * reload so the browser fetches fresh HTML with updated chunk URLs.
 * If the reload already happened recently, the error propagates to the
 * nearest ErrorBoundary.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(() =>
    importFn().catch((error: Error) => {
      if (!isStaleAssetError(error)) throw error;

      if (!reloadOnStaleAsset()) {
        throw error;
      }

      return new Promise<{ default: T }>(() => {});
    })
  );
}
