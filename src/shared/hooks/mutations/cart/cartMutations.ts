import { getLocalUser } from '@shared/services';
import { useCartOperations, useMutationHandler } from '@shared/hooks';
import { Cart, CartItem } from 'src/types/index';
import { useTranslation } from 'react-i18next';

export const useAddItemToCartMutation = () => {
  const { addItem, generateSuccessMessage } = useCartOperations();
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
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }]
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
  const { t } = useTranslation('common');

  return useMutationHandler<CartItem[], Cart>({
    mutationFn: ({ items }) => addItems(items),
    successMessage: t('toasts.success.itemsAddedToCart'),
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => removeItems(variables?.items)
  });
};

export const useDeleteUserCartMutation = () => {
  const { clearCart, addItems } = useCartOperations();
  const userId = getLocalUser()?._id;
  const { t } = useTranslation('common');

  return useMutationHandler<CartItem[], CartItem[]>({
    mutationFn: () => clearCart(),
    successMessage: t('toasts.success.cartCleared'),
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => addItems(variables)
  });
};

export const useUpdateCartMutation = () => {
  const { updateCart } = useCartOperations();
  const userId = getLocalUser()?._id;
  const { t } = useTranslation('common');

  return useMutationHandler<Cart, Cart>({
    mutationFn: (newCart) => updateCart(newCart),
    successMessage: t('toasts.success.cartUpdated'),
    invalidateQueries: [{ queryKey: 'cart', targetId: userId }],
    undoAction: (variables, _data) => updateCart(variables)
  });
};
