import { useAddItemToCartMutation, useRemoveItemFromCartMutation } from '@shared/hooks';
import { useReserveNextStudioItemTimeSlotMutation, useReleaseLastStudioItemTimeSlotMutation } from '@shared/hooks';
import { CartItem } from 'src/types/index';

export const useCartItemQuantityHandler = (item: CartItem) => {
  const addItemToCartMutation = useAddItemToCartMutation();
  const removeItemFromCartMutation = useRemoveItemFromCartMutation();
  const reserveItemTimeSlotMutation = useReserveNextStudioItemTimeSlotMutation(item.itemId);
  const releaseItemTimeSlotMutation = useReleaseLastStudioItemTimeSlotMutation(item.itemId);

  const handleQuantityChange = (e: React.MouseEvent | React.KeyboardEvent, isIncrement: boolean = true) => {
    e.stopPropagation();

    const quantity = isIncrement ? (item.quantity || 0) + 1 : Math.max((item.quantity || 1) - 1, 0);

    const newItem = {
      ...item,
      quantity,
      total: item.price * quantity,
      hours: quantity
    };

    if (isIncrement) {
      reserveItemTimeSlotMutation.mutate(
        { ...newItem, hours: quantity },
        {
          onSuccess: () => {
            addItemToCartMutation.mutate({ ...newItem, hours: 1 });
          },
          onError: (error) => {
            console.error('Booking failed:', error);
          }
        }
      );
    } else {
      releaseItemTimeSlotMutation.mutate(
        { ...newItem, hours: quantity || 0 },
        {
          onSuccess: () => {
            removeItemFromCartMutation.mutate(item);
          },
          onError: (error) => {
            console.error('Booking error, unable to release time slot:', error);
          }
        }
      );
    }
  };

  return { handleQuantityChange };
};
