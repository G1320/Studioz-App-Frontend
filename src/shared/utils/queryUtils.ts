import { QueryClient } from '@tanstack/react-query';

/**
 * Invalidate item queries
 * Supports both single itemId and array of itemIds for bulk operations
 */
export const invalidateItemQueries = (queryClient: QueryClient, itemId?: string | string[]) => {
  // Handle both single itemId and array of itemIds
  const ids = Array.isArray(itemId) ? itemId : itemId ? [itemId] : [];
  
  // Invalidate individual item queries
  ids.forEach(id => {
    queryClient.invalidateQueries({
      queryKey: ['item', id]
    });
  });
  
  // Invalidate items list query once (not per item)
  queryClient.invalidateQueries({
    queryKey: ['items']
  });

  // Also invalidate studio queries since item availability depends on studio active status
  queryClient.invalidateQueries({
    queryKey: ['studios']
  });
  queryClient.invalidateQueries({
    queryKey: ['studio']
  });
};

/**
 * Invalidate studio queries
 */
export const invalidateStudioQueries = (queryClient: QueryClient, studioId?: string | string[]) => {
  const ids = Array.isArray(studioId) ? studioId : studioId ? [studioId] : [];
  
  ids.forEach(id => {
    queryClient.invalidateQueries({
      queryKey: ['studio', id]
    });
  });
  
  queryClient.invalidateQueries({
    queryKey: ['studios']
  });
};
export const invalidateCartQueries = (queryClient: QueryClient, userId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['cart', userId]
  });
};

export const invalidateReservationQueries = (queryClient: QueryClient, reservationIds?: string | string[]) => {
  const ids = Array.isArray(reservationIds) ? reservationIds : reservationIds ? [reservationIds] : [];

  ids.forEach((id) => {
    queryClient.invalidateQueries({ queryKey: ['reservation', id] });
  });

  // Broad invalidation to refresh lists and any other reservation caches
  queryClient.invalidateQueries({ queryKey: ['reservationsList'] });
  queryClient.invalidateQueries({ queryKey: ['reservations'] });
};
