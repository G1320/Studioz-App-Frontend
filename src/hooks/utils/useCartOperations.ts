import { getLocalOfflineCart } from '../../services/cart-service';
import { getLocalUser } from '../../services/user-service';
import { useOfflineCartContext } from '../../contexts/OfflineCartContext';
import { Cart } from '../../types/index';
import {  updateOfflineCart } from '../../utils/cartUtils' ;
import * as cartService from '../../services/cart-service';

const useCartOperations = () => {
  const user = getLocalUser();
  const { setOfflineCartContext } = useOfflineCartContext();

  const addItem = async (itemId: string) => {
    if (user && user._id) {
      return cartService.addItemToCart(user._id, itemId);
    }

    const cart = getLocalOfflineCart() || { items: [] };
    cart.items.push(itemId);
    updateOfflineCart(cart, setOfflineCartContext);
    return cart;
  };

  const removeItem = async (itemId: string) => {
    if (user && user._id) {
      return cartService.removeItemFromCart(user._id, itemId);
    }

    const cart = getLocalOfflineCart() || { items: [] };
    const itemIndex = cart.items.findIndex((item: string) => item === itemId);
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
    }
    updateOfflineCart({ items: cart.items }, setOfflineCartContext);
    return { items: cart.items };
  };

  const addItems = async (items: string[]) => {
    if (user && user._id) {
      return cartService.addItemsToCart(user._id, items);
    }
    throw new Error('User must be logged in to add items to the cart.');
  };

  const removeItems = async (items: string[]) => {
    if (user && user._id) {
      return cartService.removeItemsFromCart(user._id, items);
    }
    throw new Error('User must be logged in to remove items from the cart.');
  };

  const clearCart = async () => {
    if (user && user._id) {
      await cartService.deleteUserCart(user._id);
    }
    updateOfflineCart({ items: [] }, setOfflineCartContext);
    return [];
  };

  const updateCart = async (newCart: Cart) => {
    if (user && user._id) {
      return cartService.updateUserCart(user._id, newCart);
    }
    throw new Error('User is not authenticated');
  };

  return {
    addItem,
    removeItem,
    addItems,
    removeItems,
    clearCart,
    updateCart,
  };
};

export default useCartOperations;
