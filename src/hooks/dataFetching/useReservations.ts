import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReservations } from '@services/index';
import { Reservation } from 'src/types/index';

export const useReservations = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reservations', {}],
    staleTime: 5 * 60 * 1000,
    queryFn: getReservations,
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Reservation[]>(['reservations'])
  });

  return { data, isLoading, error, refetch };
};
