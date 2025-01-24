import { useMutationHandler, useInvalidateQueries, useLanguageNavigate } from '@shared/hooks/utils/index';
import {
  createWishlistAndAddToUser,
  deleteWishlist,
  updateWishlist,
  addStudioToWishlist
} from '@shared/services/index';
import { Wishlist } from 'src/types/index';

export const useCreateWishlistMutation = (userId: string) => {
  const languageNavigate = useLanguageNavigate();

  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (newWishlist) => createWishlistAndAddToUser(userId, newWishlist),
    successMessage: 'Wishlist created',
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }],
    onSuccess: () => languageNavigate('/wishlists')
  });
};

export const useDeleteWishlistMutation = (userId: string) => {
  return useMutationHandler<Wishlist, string>({
    mutationFn: (wishlistId) => deleteWishlist(userId, wishlistId),
    successMessage: 'Wishlist deleted',
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }]
  });
};

export const useUpdateWishlistMutation = (wishlistId: string) => {
  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (updatedWishlist) => updateWishlist(wishlistId, updatedWishlist),
    successMessage: 'Wishlist updated',
    invalidateQueries: [{ queryKey: 'wishlist', targetId: wishlistId }]
  });
};

export const useAddStudioToWishlistMutation = (studioId: string) => {
  const invalidateQueries = useInvalidateQueries<string>((wishlistId) => [
    { queryKey: 'wishlistItems', targetId: wishlistId }
  ]);

  return useMutationHandler<Wishlist, string>({
    mutationFn: (wishlistId) => addStudioToWishlist(studioId, wishlistId),
    successMessage: 'Studio added to wishlist',
    invalidateQueries: [],
    onSuccess: (_data, variables) => invalidateQueries(variables)
  });
};
