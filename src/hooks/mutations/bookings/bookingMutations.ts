import { useMutationHandler } from '@hooks/utils/index';
import { releaseLastTimeSlot, reserveNextTimeSlot, reserveTimeSlots } from '@services/booking-service';
import { CartItem, Item } from 'src/types/index';

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
  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return reserveTimeSlots(item);
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }]
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
