import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReservations, PaginatedReservationsResponse } from '@shared/services';
import { Reservation } from 'src/types/index';

export const useReservations = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reservations'],
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 30000, // Poll every 30 seconds
    queryFn: async () => {
      const response = await getReservations({ limit: 100 });
      return response.reservations;
    },
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Reservation[]>(['reservations'])
  });

  return { data: data || [], isLoading, error, refetch };
};
