import { getLocalUser } from '@/services';
import { useCartOperations, useMutationHandler } from '@/hooks/utils';
import { Cart, CartItem } from '@/types/index';

export const useAddItemToCartMutation = () => {
  const { addItem, removeItem } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<Cart, { itemId: string; bookingDate: Date }>({
    mutationFn: ({ itemId, bookingDate }) => addItem(itemId, bookingDate),
    successMessage: 'Item added to cart',
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => removeItem(variables.itemId),
  });
};

export const useAddItemsToCartMutation = () => {
  const { addItems, removeItems } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<CartItem[], Cart>({
    mutationFn: ({ items }) => addItems(items),
    successMessage: 'Items added to cart',
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => removeItems(variables.items.map(item => item.itemId))
  });
};

export const useRemoveItemFromCartMutation = () => {
  const { removeItem, addItem } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<Cart, string>({
    mutationFn: (itemId) => removeItem(itemId),
    successMessage: 'Item removed from cart',
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => addItem(variables, new Date()) // Note: This undo action might need adjustment
  });
};

export const useDeleteUserCartMutation = () => {
  const { clearCart, addItems } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<CartItem[], CartItem[]>({
    mutationFn: () => clearCart(),
    successMessage: 'Cart cleared',
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => addItems(variables)
  });
};

export const useUpdateCartMutation = () => {
  const { updateCart } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<Cart, Cart>({
    mutationFn: (newCart) => updateCart(newCart),
    successMessage: 'Cart updated',
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => updateCart(variables)
  });
};

