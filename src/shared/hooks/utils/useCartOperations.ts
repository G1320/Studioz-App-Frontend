import { useOfflineCartContext, useUserContext } from '@core/contexts';
import { updateOfflineCart } from '@shared/utils';
import {
  getLocalOfflineCart,
  addItemToCart,
  removeItemFromCart,
  addItemsToCart,
  removeItemsFromCart,
  deleteUserCart,
  updateUserCart
} from '@shared/services';
import { Cart, CartItem } from 'src/types/index';

export const useCartOperations = () => {
  const { user } = useUserContext();
  const { setOfflineCartContext } = useOfflineCartContext();

  const generateSuccessMessage = (item: CartItem, action: string) => {
    if (action == 'added') {
      return `${action} ${item.name.en} service at ${item.studioName.en} `;
    } else if (action == 'booked') {
      return `${item.hours} hours of ${item.name.en} service at ${item.studioName.en} ${action} for ${item.bookingDate} at ${item.startTime}`;
    } else {
      return `removed ${item.name.en} service at ${item.studioName.en} `;
    }
  };

  const addItem = async (item: CartItem) => {
    if (user && user._id) {
      return addItemToCart(
        user._id,
        item.itemId,
        item.bookingDate || '',
        item.startTime || '',
        item.hours || 1,
        item.comment || '',
        item.costumerName || '',
        item.costumerPhone || '',
        item.reservationId || ''
      );
    }
    const cart = getLocalOfflineCart() || { items: [] };
    const existingItem = cart.items.find(
      (cartItem: CartItem) => cartItem.itemId === item.itemId && cartItem.bookingDate === item.bookingDate
    );

    if (existingItem && existingItem.quantity) {
      existingItem.quantity += item.hours || 1;
      existingItem.total = (existingItem.price || 0) * existingItem.quantity;
    } else {
      cart.items.push({
        name: {
          en: item.name.en,
          he: item.name.he
        },
        studioName: {
          en: item.studioName?.en || '',
          he: item.studioName?.he
        },
        studioId: item.studioId,
        price: item.price || 0,
        total: (item.price || 0) * (item.hours || 1),
        quantity: item.hours || 1,
        itemId: item.itemId,
        bookingDate: item.bookingDate,
        startTime: item.startTime,
        costumerName: item.costumerName || '',
        costumerPhone: item.costumerPhone || '',
        comment: item.comment || '',
        reservationId: item.reservationId || ''
      });
    }
    updateOfflineCart(cart, setOfflineCartContext);
    return cart;
  };

  const removeItem = async (item: CartItem) => {
    if (user && user._id) {
      return removeItemFromCart(user._id, item);
    }
    const cart = getLocalOfflineCart() || { items: [] };
    const itemIndex = cart.items.findIndex(
      (cartItem: CartItem) => cartItem.itemId === item.itemId && cartItem.bookingDate === item.bookingDate
    );

    if (itemIndex !== -1) {
      const cartItem = cart.items[itemIndex];
      if (cartItem.quantity && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        cartItem.total = (cartItem.price || 0) * cartItem.quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    }
    updateOfflineCart({ items: cart.items }, setOfflineCartContext);
    return { items: cart.items };
  };

  const addItems = async (items: CartItem[]) => {
    if (user && user._id) {
      return addItemsToCart(user._id, items);
    }
    throw new Error('User must be logged in to add items to the cart.');
  };

  const removeItems = async (items: CartItem[]) => {
    if (user && user._id) {
      return removeItemsFromCart(
        user._id,
        items.map((item: CartItem) => item.itemId)
      );
    }
    throw new Error('User must be logged in to remove items from the cart.');
  };

  const clearCart = async () => {
    if (user && user._id) {
      await deleteUserCart(user._id);
    }
    updateOfflineCart({ items: [] }, setOfflineCartContext);
    return [];
  };

  const updateCart = async (newCart: Cart) => {
    if (user && user._id) {
      return updateUserCart(user._id, newCart);
    }
    throw new Error('User is not authenticated');
  };

  return {
    generateSuccessMessage,
    addItem,
    removeItem,
    addItems,
    removeItems,
    clearCart,
    updateCart
  };
};
