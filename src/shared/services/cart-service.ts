import { parseJSON, stringifyJSON } from '@shared/utils';
import { httpService } from '@shared/services';
import { Cart, CartItem } from 'src/types/index';

const cartEndpoint = '/cart';

export const getLocalOfflineCart = (): Cart | null => parseJSON<Cart>('offlineCart', null);
export const setLocalOfflineCart = (cart: Cart): void => stringifyJSON('offlineCart', cart);

export const addItemToCart = async (
  userId: string,
  itemId: string,
  bookingDate: string,
  startTime: string,
  hours?: number,
  costumerName?: string,
  costumerPhone?: string,
  comment?: string,
  reservationId?: string
): Promise<Cart> => {
  if (itemId === undefined) throw new Error('Item ID is required');
  try {
    return await httpService.post(`${cartEndpoint}/${userId}/add-to-cart/${itemId}`, {
      bookingDate,
      startTime,
      hours,
      costumerName,
      costumerPhone,
      comment,
      reservationId
    });
  } catch (error: unknown) {
    console.error('Failed to add item to cart', error);
    throw error;
  }
};

export const addItemsToCart = async (userId: string, items: CartItem[]): Promise<CartItem[]> => {
  if (!items || items.length === 0) throw new Error('Items are required');
  try {
    return await httpService.post(`${cartEndpoint}/${userId}/add-items-to-cart`, { items });
  } catch (error: unknown) {
    console.error('Failed to add items to cart', error);
    throw error;
  }
};

export const removeItemFromCart = async (userId: string, item: CartItem): Promise<Cart> => {
  try {
    return await httpService.delete(`${cartEndpoint}/${userId}/remove-from-cart/${item.itemId}`, item);
  } catch (error: unknown) {
    console.error('Failed to remove item from cart', error);
    throw error;
  }
};

export const removeItemsFromCart = async (userId: string, itemIds: string[]): Promise<CartItem[]> => {
  try {
    return await httpService.delete(`${cartEndpoint}/${userId}/remove-items-from-cart`, { itemIds });
  } catch (error: unknown) {
    console.error('Failed to remove items from cart', error);
    throw error;
  }
};

export const getUserCart = async (userId: string): Promise<Cart> => {
  const offlineCart = getLocalOfflineCart();
  if (offlineCart) return offlineCart;
  try {
    return await httpService.get(`${cartEndpoint}/${userId}`);
  } catch (error: unknown) {
    console.error('Failed to get user cart', error);
    throw error;
  }
};

export const deleteUserCart = async (userId: string): Promise<CartItem[] | []> => {
  try {
    return await httpService.delete(`${cartEndpoint}/${userId}/delete-cart`);
  } catch (error: unknown) {
    console.error('Failed to delete user cart', error);
    throw error;
  }
};

export const updateUserCart = async (userId: string, cartData: Cart): Promise<Cart> => {
  try {
    return await httpService.put(`${cartEndpoint}/${userId}/update-cart`, { cart: cartData });
  } catch (error: unknown) {
    console.error('Failed to update user cart', error);
    throw error;
  }
};

export const checkout = async (userId: string): Promise<void> => {
  try {
    await httpService.post<void>(`${cartEndpoint}/${userId}/checkout`);
  } catch (error: unknown) {
    console.error('Failed to checkout', error);
    throw error;
  }
};
