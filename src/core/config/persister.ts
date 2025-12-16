import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/**
 * Safe localStorage wrapper with error handling for React Query persistence
 * Handles quota exceeded errors gracefully
 */
const safeStorage = {
  getItem: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      if (error instanceof DOMException && (error.code === 22 || error.name === 'QuotaExceededError')) {
        console.warn('localStorage quota exceeded for React Query cache, clearing old cache...');
        // Clear React Query cache if quota exceeded
        try {
          window.localStorage.removeItem(key);
          window.localStorage.setItem(key, value);
        } catch {
          console.error('Failed to save React Query cache after cleanup');
        }
      } else {
        throw error;
      }
    }
  },
  removeItem: (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

/**
 * React Query persister configuration
 * Handles persistence to localStorage with error handling
 *
 * Note: Cache versioning is handled via maxAge in persistenceOptions
 * To invalidate cache on schema changes, increment maxAge or clear localStorage
 */
export const persister = createSyncStoragePersister({
  storage: safeStorage,
  serialize: JSON.stringify,
  deserialize: JSON.parse
});
