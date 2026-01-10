import { useMutationHandler } from '@shared/hooks';
import { cancelReservationById, updateReservationById, approveReservationById } from '@shared/services';
import { Reservation } from 'src/types/index';
import { useQueryClient } from '@tanstack/react-query';

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutationHandler<Reservation, string>({
    mutationFn: (reservationId: string) => cancelReservationById(reservationId),
    successMessage: 'Reservation cancelled successfully',
    invalidateQueries: [{ queryKey: 'reservationsList' }, { queryKey: 'reservations' }],
    onSuccess: (_data, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] }),
        queryClient.invalidateQueries({ queryKey: ['reservationsList'] });
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

export const useApproveReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutationHandler<Reservation, string>({
    mutationFn: (reservationId: string) => approveReservationById(reservationId),
    successMessage: 'Reservation approved successfully',
    invalidateQueries: [{ queryKey: 'reservationsList' }, { queryKey: 'reservations' }],
    onSuccess: (_data, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      queryClient.invalidateQueries({ queryKey: ['reservationsList'] });
    }
  });
};
