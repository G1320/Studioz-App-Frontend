import { parseJSON, stringifyJSON } from '../utils/storageUtils';
import { httpService } from './http-service';

const cartEndpoint = '/cart';

export const getLocalOfflineCart = () => parseJSON('offlineCart', null);
export const setLocalOfflineCart = (cart) => stringifyJSON('offlineCart', cart);

export const addItemToCart = async (userId, itemId) => {
  if (itemId === undefined) throw new Error('Item ID is required');
  try {
    return await httpService.post(`${cartEndpoint}/${userId}/add-to-cart/${itemId}`);
  } catch (error) {
    console.error('Failed to add item to cart', error);
    throw error;
  }
};

export const addItemsToCart = async (userId, items) => {
  if (!items || items.length === 0) throw new Error('Items are required');
  try {
    return await httpService.post(`${cartEndpoint}/${userId}/add-items-to-cart`, { items });
  } catch (error) {
    console.error('Failed to add items to cart', error);
    throw error;
  }
};

export const removeItemFromCart = async (userId, itemId) => {
  try {
    return await httpService.delete(`${cartEndpoint}/${userId}/remove-from-cart/${itemId}`);
  } catch (error) {
    console.error('Failed to remove item from cart', error);
    throw error;
  }
};

export const removeItemsFromCart = async (userId, items) => {
  try {
    return await httpService.delete(`${cartEndpoint}/${userId}/remove-items-from-cart`, { items });
  } catch (error) {
    console.error('Failed to remove items from cart', error);
    throw error;
  }
};

export const getUserCart = async (userId) => {
  try {
    return await httpService.get(`${cartEndpoint}/${userId}`);
  } catch (error) {
    console.error('Failed to get user cart', error);
    throw error;
  }
};

export const deleteUserCart = async (userId) => {
  try {
    return await httpService.delete(`${cartEndpoint}/${userId}/delete-cart`);
  } catch (error) {
    console.error('Failed to delete user cart', error);
    throw error;
  }
};

export const updateUserCart = async (userId, cartData) => {
  try {
    return await httpService.put(`${cartEndpoint}/${userId}/update-cart`, { cart: cartData });
  } catch (error) {
    console.error('Failed to update user cart', error);
    throw error;
  }
};

export const checkout = async (userId) => {
  try {
    return await httpService.post(`${cartEndpoint}/${userId}/checkout`);
  } catch (error) {
    console.error('Failed to checkout', error);
    throw error;
  }
};
