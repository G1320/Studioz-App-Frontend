import { httpService } from './http-service';

const wishlistEndpoint = '/wishlists';

export const createWishlistAndAddToUser = async (userId, wishlistData) => {
  try {
    return await httpService.post(`${wishlistEndpoint}/create/${userId}`, wishlistData);
  } catch (error) {
    console.error('Failed to create wishlist', error);
    throw error;
  }
};

export const addItemToWishlist = async (itemId, wishlistId) => {
  try {
    return await httpService.put(`${wishlistEndpoint}/add-item/${wishlistId}`, { itemId });
  } catch (error) {
    console.error('Failed to add item to wishlist', error);
    throw error;
  }
};

export const addStudioToWishlist = async (studioId, wishlistId) => {
  try {
    return await httpService.put(`${wishlistEndpoint}/add-studio/${wishlistId}`, { studioId });
  } catch (error) {
    console.error('Failed to add studio to wishlist', error);
    throw error;
  }
};

export const getUserWishlists = async (userId) => {
  try {
    return await httpService.get(`${wishlistEndpoint}/${userId}`);
  } catch (error) {
    console.error('Failed to get user wishlists', error);
    throw error;
  }
};
export const getUserWishlistById = async (userId, wishlistId) => {
  try {
    return await httpService.get(`${wishlistEndpoint}/${userId}/get-wishlist/${wishlistId}`);
  } catch (error) {
    console.error('Failed to get user wishlists', error);
    throw error;
  }
};

export const updateWishlist = async (wishlistId, wishlistData) => {
  try {
    return await httpService.put(`${wishlistEndpoint}/update-wishlist/${wishlistId}`, wishlistData);
  } catch (error) {
    console.error('Failed to update wishlist', error);
    throw error;
  }
};

export const deleteWishlist = async (userId, wishlistId) => {
  try {
    return await httpService.delete(`${wishlistEndpoint}/delete-wishlist/${userId}/${wishlistId}`);
  } catch (error) {
    console.error('Failed to delete wishlist', error);
    throw error;
  }
};

export const getWishlistById = async (wishlistId) => {
  try {
    return await httpService.get(`${wishlistEndpoint}/${wishlistId}`);
  } catch (error) {
    console.error('Failed to retrieve wishlist', error);
    throw error;
  }
};
