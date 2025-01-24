import { useMutationHandler } from '@shared/hooks/utils';
import { releaseLastTimeSlot, reserveNextTimeSlot, reserveTimeSlots } from '@shared/services';
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
  return useMutationHandler<string, CartItem>({
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
