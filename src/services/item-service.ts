import { httpService } from '@/services';
import { Item }  from '@/types/index';

const itemEndpoint = '/items';

export const createItem = async (item:Item): Promise <Item> => {
  try {
    return await httpService.post(itemEndpoint, item);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const getItems = async (params = {}): Promise <Item[]> => {
  try {
    return await httpService.get(itemEndpoint, params);
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const getItemById = async (itemId:string):Promise <Item> => {
  try {
    return await httpService.get(`${itemEndpoint}/${itemId}`);
  } catch (error) {
    console.error(`Error getting item with ID ${itemId}:`, error);
    throw error;
  }
};

export const addItemToStudio = async (studioId:string, itemId:string): Promise <Item> => {
  try {
    return await httpService.post(`${itemEndpoint}/${studioId}/add-to-studio/${itemId}`);
  } catch (error) {
    console.error('Failed to add item to studio', error);
    throw error;
  }
};

export const removeItemFromStudio = async (studioId:string, itemId:string):Promise <Item> => {
  try {
    return await httpService.delete(`${itemEndpoint}/${studioId}/remove-from-studio/${itemId}`);
  } catch (error) {
    console.error('Failed to remove item from studio', error);
    throw error;
  }
};

export const addItemToWishlist = async (wishlistId:string, itemId:string):Promise <Item> => {
  try {
    return await httpService.post(`${itemEndpoint}/${wishlistId}/add-to-wishlist/${itemId}`);
  } catch (error) {
    console.error('Failed to add item to wishlist', error);
    throw error;
  }
};

export const removeItemFromWishlist = async (wishlistId:string, itemId:string):Promise <Item> => {
  try {
    return await httpService.delete(`${itemEndpoint}/${wishlistId}/remove-from-wishlist/${itemId}`);
  } catch (error) {
    console.error('Failed to remove item from wishlist', error);
    throw error;
  }
};

export const updateItem = async (itemId:string, item:Item):Promise <Item> => {
  try {
    return await httpService.put(`${itemEndpoint}/${itemId}`, item);
  } catch (error) {
    console.error(`Error updating item with ID ${itemId}:`, error);
    throw error;
  }
};

export const deleteItem = async (itemId:string):Promise <Item> => {
  try {
    return await httpService.delete(`${itemEndpoint}/${itemId}`);
  } catch (error) {
    console.error(`Error deleting item with ID ${itemId}:`, error);
    throw error;
  }
};
