import { useMutationHandler } from '@shared/hooks';
import { deleteReservationById, updateReservationById } from '@shared/services';
import { Reservation } from 'src/types/index';
import { getLocalUser } from '@shared/services';

export const useCancelReservationMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Reservation, string>({
    mutationFn: (reservationId: string) => deleteReservationById(reservationId),
    successMessage: 'Reservation cancelled successfully',
    invalidateQueries: [
      { queryKey: 'reservationsList' },
      { queryKey: 'reservations' },
      { queryKey: 'reservation' }
    ],
    onSuccess: () => {
      // Optionally navigate back to reservations list
    }
  });
};

export const useUpdateReservationMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Reservation, { reservationId: string; updates: Partial<Reservation> }>({
    mutationFn: ({ reservationId, updates }) => updateReservationById(reservationId, updates),
    successMessage: 'Reservation updated successfully',
    invalidateQueries: [
      { queryKey: 'reservationsList' },
      { queryKey: 'reservations' },
      { queryKey: 'reservation' }
    ]
  });
};

