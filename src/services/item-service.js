import { httpService } from './http-service';

const itemEndpoint = '/items';

export const createItem = async (item) => {
  try {
    return await httpService.post(itemEndpoint, item);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

export const getItems = async (params = {}) => {
  try {
    return await httpService.get(itemEndpoint, params);
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const getItemById = async (itemId) => {
  try {
    return await httpService.get(`${itemEndpoint}/${itemId}`);
  } catch (error) {
    console.error(`Error getting item with ID ${id}:`, error);
    throw error;
  }
};

export const addItemToStudio = async (studioId, itemId) => {
  try {
    return await httpService.post(`${itemEndpoint}/${studioId}/add-to-studio/${itemId}`);
  } catch (error) {
    console.error('Failed to add item to studio', error);
    throw error;
  }
};

export const removeItemFromStudio = async (studioId, itemId) => {
  try {
    return await httpService.delete(`${itemEndpoint}/${studioId}/remove-from-studio/${itemId}`);
  } catch (error) {
    console.error('Failed to remove item from studio', error);
    throw error;
  }
};

export const addItemToWishlist = async (wishlistId, itemId) => {
  try {
    return await httpService.post(`${itemEndpoint}/${wishlistId}/add-to-wishlist/${itemId}`);
  } catch (error) {
    console.error('Failed to add item to wishlist', error);
    throw error;
  }
};

export const removeItemFromWishlist = async (wishlistId, itemId) => {
  try {
    return await httpService.delete(`${itemEndpoint}/${wishlistId}/remove-from-wishlist/${itemId}`);
  } catch (error) {
    console.error('Failed to remove item from wishlist', error);
    throw error;
  }
};

export const updateItem = async (id, item) => {
  try {
    return await httpService.put(`${itemEndpoint}/${id}`, item);
  } catch (error) {
    console.error(`Error updating item with ID ${id}:`, error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    return await httpService.delete(`${itemEndpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting item with ID ${id}:`, error);
    throw error;
  }
};
