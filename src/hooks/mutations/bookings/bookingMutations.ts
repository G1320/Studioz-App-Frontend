import { useMutationHandler } from '@hooks/utils/index';
import { releaseLastTimeSlot, reserveNextTimeSlot, reserveTimeSlots } from '@services/booking-service';
import { getLocalUser } from '@services/index';
import { CartItem, Item } from '@models/index';

export const useReserveNextStudioItemTimeSlotMutation = (itemId: string) => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return reserveNextTimeSlot(item, userId || '');
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }]
  });
};

export const useReserveStudioItemTimeSlotsMutation = (itemId: string) => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return reserveTimeSlots(item, userId || '');
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
