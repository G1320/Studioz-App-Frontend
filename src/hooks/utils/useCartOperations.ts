import { useOfflineCartContext } from '@/contexts';
import { updateOfflineCart } from '@/utils/cartUtils';
import { getLocalUser, getLocalOfflineCart, addItemToCart, removeItemFromCart, addItemsToCart, removeItemsFromCart, deleteUserCart, updateUserCart } from '@/services';
import { Cart, CartItem } from '@/types/index';
import dayjs from 'dayjs';

export const useCartOperations = () => {
  const user = getLocalUser();
  const { setOfflineCartContext } = useOfflineCartContext();

  const generateSuccessMessage = (item: CartItem) => {
    const formattedDate = dayjs(item.bookingDate).format('DD/MM/YYYY HH:mm');
    return `${item.name} service at ${item.studioName} booked for ${formattedDate}`;
  };

  const addItem = async (item: CartItem, bookingDate: Date) => {
    if (user && user._id) {
      return addItemToCart(user._id, item.itemId, bookingDate);
    }
    const cart = getLocalOfflineCart() || { items: [] };
    const existingItem = cart.items.find((cartItem: CartItem) => cartItem.itemId === item.itemId);

    if (existingItem && existingItem.quantity) {
      existingItem.quantity += 1;
      existingItem.total = (existingItem.price || 0) * existingItem.quantity;

    } else {
      cart.items.push({
        name: item.name,
        studioName: item.studioName,
        price: item.price,
        total: item.price,
        quantity: 1,
        itemId: item.itemId,
        bookingDate: bookingDate,
      });
    }
    updateOfflineCart(cart, setOfflineCartContext);
    return cart;
  };

  const removeItem = async (itemId: string) => {
    if (user && user._id) {
      return removeItemFromCart(user._id, itemId);
    }
    const cart = getLocalOfflineCart() || { items: [] };
    const itemIndex = cart.items.findIndex((item: CartItem) => item.itemId === itemId);
  
    if (itemIndex !== -1) {
      const cartItem = cart.items[itemIndex];
      if (cartItem.quantity && cartItem.quantity  > 1) {
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

  const removeItems = async (itemIds: string[]) => {
    if (user && user._id) {
      return removeItemsFromCart(user._id, itemIds);
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
    updateCart,
  };
};

export default useCartOperations;

