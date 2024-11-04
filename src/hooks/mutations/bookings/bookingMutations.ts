import { useMutationHandler } from '@hooks/utils/index';
import { reserveTimeSlot } from '@services/booking-service';
import { getLocalUser } from '@services/index';
import { CartItem, Item } from '@models/index';

export const useReserveStudioItemTimeSlotMutation = (itemId: string) => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return reserveTimeSlot(item, userId || '');
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }]
  });
};
