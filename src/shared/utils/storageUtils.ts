/**
 * Cleanup old localStorage data to free up space
 * Removes old reservations, expired cache entries, etc.
 */
const cleanupOldStorage = (): void => {
  try {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Remove old reservations (older than 30 days)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('reservation_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.timestamp && data.timestamp < thirtyDaysAgo) {
            localStorage.removeItem(key);
          }
        } catch {
          // If parsing fails, remove the key
          localStorage.removeItem(key);
        }
      }
    });

    // Clear old React Query cache if too large (>2MB)
    const cacheKey = 'REACT_QUERY_OFFLINE_CACHE';
    const cache = localStorage.getItem(cacheKey);
    if (cache && cache.length > 2 * 1024 * 1024) {
      // Cache is too large, clear it
      localStorage.removeItem(cacheKey);
      console.warn('React Query cache cleared due to size limit');
    }
  } catch (error) {
    console.error('Error during storage cleanup:', error);
  }
};

export const parseJSON = <T>(key: string, defaultValue: T | null): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : defaultValue;
  } catch (error) {
    console.error(`Error parsing JSON for key "${key}":`, error);
    return defaultValue;
  }
};

export const stringifyJSON = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && (error.code === 22 || error.name === 'QuotaExceededError')) {
      console.warn('localStorage quota exceeded, attempting cleanup...');
      
      // Try cleanup and retry once
      cleanupOldStorage();
      
      try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log('Storage operation succeeded after cleanup');
      } catch (retryError) {
        console.error('Storage quota exceeded even after cleanup. Consider reducing cache size.', retryError);
        // Optionally: fallback to sessionStorage or memory-only storage
        // For now, we'll just log the error and continue
      }
    } else {
      // Re-throw other errors
      throw error;
    }
  }
};
