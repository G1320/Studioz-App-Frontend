import { QueryClient } from '@tanstack/react-query';

export const invalidateItemQueries = (queryClient: QueryClient, itemId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['item', itemId]
  });
  queryClient.invalidateQueries({
    queryKey: ['items']
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
