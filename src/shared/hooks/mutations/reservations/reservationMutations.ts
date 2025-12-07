import { useMutationHandler } from '@shared/hooks';
import { deleteReservationById, updateReservationById } from '@shared/services';
import { Reservation } from 'src/types/index';
import { useQueryClient } from '@tanstack/react-query';

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutationHandler<Reservation, string>({
    mutationFn: (reservationId: string) => deleteReservationById(reservationId),
    successMessage: 'Reservation cancelled successfully',
    invalidateQueries: [{ queryKey: 'reservationsList' }, { queryKey: 'reservations' }],
    onSuccess: (_data, reservationId) => {
      // Invalidate the specific reservation query
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      // Optionally navigate back to reservations list
    }
  });
};

export const useUpdateReservationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutationHandler<Reservation, { reservationId: string; updates: Partial<Reservation> }>({
    mutationFn: ({ reservationId, updates }) => updateReservationById(reservationId, updates),
    successMessage: 'Reservation updated successfully',
    invalidateQueries: [{ queryKey: 'reservationsList' }, { queryKey: 'reservations' }],
    onSuccess: (_data, variables) => {
      // Invalidate the specific reservation query
      queryClient.invalidateQueries({ queryKey: ['reservation', variables.reservationId] });
    }
  });
};
