import { Cart, CartItem } from 'src/types/index';
import { getLocalOfflineCart, setLocalOfflineCart } from '../services';

export const updateOfflineCart = (cart: Cart, setOfflineCart: (cart: Cart) => void) => {
  setLocalOfflineCart(cart);
  setOfflineCart(cart);
};

export const calculateTotalPrice = (items: CartItem[] = []): number => {
  return items.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);
};

export const removeExpiredItemsFromOfflineCart = (reservationIds: string[]) => {
  const cart = getLocalOfflineCart();
  if (!cart?.items?.length) return;

  // Filter out expired items
  const updatedCart = {
    items: cart.items.filter((item: CartItem) => !reservationIds.includes(item.reservationId || ''))
  };

  // Update localStorage
  setLocalOfflineCart(updatedCart);
  return updatedCart;
};
