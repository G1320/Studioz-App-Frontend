import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReservationById } from '@services/index';
import { Reservation } from 'src/types/index';

export const useReservation = (reservationId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reservation', reservationId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => getReservationById(reservationId),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Reservation>(['reservation', reservationId])
  });

  return { data, isLoading, error, refetch };
};
