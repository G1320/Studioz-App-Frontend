import { persister } from './persister';

/**
 * Determines which queries should be persisted to localStorage
 * Only persists critical, user-specific data with appropriate TTL
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

  // ⚠️ PERSIST WITH SHORT TTL: Studios/Items arrays (for instant load on refresh)
  // We persist these but with shorter maxAge (2 hours) to balance performance vs freshness
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
 * Configures which queries to persist and for how long
 */
export const persistOptions = {
  persister,
  maxAge: 1000 * 60 * 60 * 2, // 2 hours max age (studios/items refresh after 2h for freshness)
  dehydrateOptions: {
    shouldDehydrateQuery
  }
};

