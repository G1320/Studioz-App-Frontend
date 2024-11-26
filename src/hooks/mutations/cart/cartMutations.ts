import { getLocalUser } from '@services/index';
import { useCartOperations, useMutationHandler } from '@hooks/utils/index';
import { Cart, CartItem } from 'src/types/index';

export const useAddItemToCartMutation = () => {
  const { addItem, removeItem, generateSuccessMessage } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<Cart, CartItem>({
    mutationFn: (item: CartItem) => {
      if (!item.bookingDate) throw new Error('Invalid booking date or time');
      return addItem(item);
    },
    successMessage: (_data, variables) => {
      if (variables.quantity === undefined) {
        return generateSuccessMessage(variables, 'booked');
      }
      return generateSuccessMessage(variables, 'added');
    },
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => removeItem(variables)
  });
};

export const useRemoveItemFromCartMutation = () => {
  const { removeItem, addItem, generateSuccessMessage } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<Cart, CartItem>({
    mutationFn: (item: CartItem) => removeItem(item),
    successMessage: (_data, variables) => generateSuccessMessage(variables, 'removed'),
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => addItem(variables)
  });
};

export const useAddItemsToCartMutation = () => {
  const { addItems, removeItems } = useCartOperations();
  const userId = getLocalUser()?._id;

  return useMutationHandler<CartItem[], Cart>({
    mutationFn: ({ items }) => addItems(items),
    successMessage: 'Items added to cart',
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => removeItems(variables?.items)
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
