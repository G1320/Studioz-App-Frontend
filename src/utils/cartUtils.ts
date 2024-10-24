import { Cart, CartItem } from '../types/index';
import { setLocalOfflineCart } from '../services/cart-service';

// Function to update the offline cart
export const updateOfflineCart = (cart: Cart, setOfflineCart: (cart: Cart) => void) => {
  setLocalOfflineCart(cart);
  setOfflineCart(cart);
};

export const calculateTotalPrice = (items: CartItem[] = []): number => {
  return items.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);
};
