import { persister } from './persister';

/**
 * Determines which queries should be persisted to localStorage
 * Only persists critical, user-specific data with appropriate TTL
 * 
 * IMPORTANT: Persisted data is just for instant initial render.
 * Fresh data is always fetched in background due to short staleTime.
 */
const shouldDehydrateQuery = (query: any): boolean => {
  const queryKey = query.queryKey[0];

  // ✅ PERSIST: User-specific, small, rarely changes
  const persistableKeys = ['user', 'cart', 'wishlists', 'wishlistItems'];

  // ✅ PERSIST: Individual studio/item details (smaller, less frequent changes)
  // But only if they're individual queries, not arrays
  if (queryKey === 'studio' && query.queryKey.length === 2) {
    return true; // Individual studio: ['studio', studioId]
  }
  if (queryKey === 'item' && query.queryKey.length === 2) {
    return true; // Individual item: ['item', itemId]
  }

  // ✅ PERSIST: Studios/Items arrays for instant load
  // Fresh data will be fetched in background immediately due to short staleTime
  if (queryKey === 'studios' && query.queryKey.length <= 2) {
    return true; // Persist studios array: ['studios'] or ['studios', {}]
  }
  if (queryKey === 'items' && query.queryKey.length <= 2) {
    return true; // Persist items array: ['items'] or ['items', {}]
  }

  // ❌ DON'T PERSIST: Data that changes very frequently
  const nonPersistableKeys = [
    'reservations',
    'reservationsList',
    'notifications',
    'notificationCount',
    'search'
  ];

  // Check if it's a persistable key
  if (persistableKeys.includes(queryKey as string)) {
    return true;
  }

  // Check if it's a non-persistable key
  if (nonPersistableKeys.includes(queryKey as string)) {
    return false;
  }

  // Default: don't persist unknown queries (safer)
  return false;
};

/**
 * React Query persistence options
 * 
 * maxAge: Maximum time to keep persisted data in localStorage
 * - After maxAge, persisted data is ignored on app load
 * - Fresh data will be fetched anyway due to short staleTime,
 *   but maxAge prevents showing VERY old data as initial state
 */
export const persistOptions = {
  persister,
  // 4 hours max - prevents showing data from yesterday
  // Fresh data fetches in background regardless, but this ensures
  // we don't show extremely stale data as initial render
  maxAge: 1000 * 60 * 60 * 4, // 4 hours
  dehydrateOptions: {
    shouldDehydrateQuery
  }
};
