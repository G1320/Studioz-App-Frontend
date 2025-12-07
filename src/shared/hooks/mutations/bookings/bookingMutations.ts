import { useMutationHandler } from '@shared/hooks/utils';
import { releaseLastTimeSlot, reserveNextTimeSlot, reserveTimeSlots } from '@shared/services';
import { CartItem, Item } from 'src/types/index';
import { useQueryClient } from '@tanstack/react-query';

export const useReserveNextStudioItemTimeSlotMutation = (itemId: string) => {
  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return reserveNextTimeSlot(item);
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }]
  });
};

export const useReserveStudioItemTimeSlotsMutation = (itemId: string) => {
  const queryClient = useQueryClient();

  return useMutationHandler<string, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return reserveTimeSlots(item);
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }],
    onSuccess: (reservationId) => {
      // Invalidate all reservation queries to ensure the list updates
      queryClient.invalidateQueries({ queryKey: ['reservationsList'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });

      // Invalidate the specific reservation query if we have the reservationId
      if (reservationId) {
        queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] });
      }
    }
  });
};

export const useReleaseLastStudioItemTimeSlotMutation = (itemId: string) => {
  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return releaseLastTimeSlot(item);
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }]
  });
};
