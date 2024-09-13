import { httpService } from '@/services';

import { Wishlist, WishlistResponse } from '@/types/index';

const wishlistEndpoint = '/wishlists';

export const createWishlistAndAddToUser = async (userId: string, wishlistData:Wishlist):Promise<Wishlist> => {
  try {
    return await httpService.post(`${wishlistEndpoint}/create/${userId}`, wishlistData);
  } catch (error) {
    console.error('Failed to create wishlist', error);
    throw error;
  }
};

export const addStudioToWishlist = async (studioId: string, wishlistId: string):Promise<Wishlist> => {
  try {
    return await httpService.put(`${wishlistEndpoint}/add-studio/${wishlistId}`, { studioId });
  } catch (error) {
    console.error('Failed to add studio to wishlist', error);
    throw error;
  }
};

export const getWishlists = async (userId: string):Promise<Wishlist[]> => {
  try {
    return await httpService.get(`${wishlistEndpoint}/${userId}`);
  } catch (error) {
    console.error('Failed to get wishlists', error);
    throw error;
  }
};

export const getUserWishlistById = async (userId: string, wishlistId: string):Promise<WishlistResponse> => {
  try {
    return await httpService.get(`${wishlistEndpoint}/${userId}/get-wishlist/${wishlistId}`);
  } catch (error) {
    console.error('Failed to get user wishlists', error);
    throw error;
  }
};

export const updateWishlist = async (wishlistId: string, wishlistData:Wishlist):Promise<Wishlist> => {
  try {
    return await httpService.put(`${wishlistEndpoint}/update-wishlist/${wishlistId}`, wishlistData);
  } catch (error) {
    console.error('Failed to update wishlist', error);
    throw error;
  }
};

export const deleteWishlist = async (userId: string, wishlistId: string):Promise<Wishlist> => {
  try {
    return await httpService.delete(`${wishlistEndpoint}/delete-wishlist/${userId}/${wishlistId}`);
  } catch (error) {
    console.error('Failed to delete wishlist', error);
    throw error;
  }
};

export const getWishlistById = async (wishlistId: string):Promise<Wishlist> => {
  try {
    return await httpService.get(`${wishlistEndpoint}/${wishlistId}`);
  } catch (error) {
    console.error('Failed to retrieve wishlist', error);
    throw error;
  }
};
