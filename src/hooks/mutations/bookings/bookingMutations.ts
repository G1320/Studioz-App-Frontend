import { useMutationHandler } from '@hooks/utils/index';
import { bookStudioItem } from '@services/booking-service';
import { getLocalUser } from '@services/index';
import { CartItem, Item } from '@models/index';

export const useBookStudioItemMutation = (itemId: string) => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Item, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return bookStudioItem(item, userId || '');
    },
    invalidateQueries: [{ queryKey: 'item', targetId: itemId }, { queryKey: 'items' }]
  });
};
