import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReservationsByStudioId } from '@services/index';
import { Reservation } from 'src/types/index';

export const useStudioReservations = (studioId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studioReservations', studioId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => getReservationsByStudioId(studioId),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Reservation[]>(['studioReservations', studioId])
  });

  return { data, isLoading, error, refetch };
};
