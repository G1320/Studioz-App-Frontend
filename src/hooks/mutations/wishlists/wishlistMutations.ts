import { useNavigate } from 'react-router-dom';
import { useMutationHandler, useInvalidateQueries } from '@hooks/utils/index';
import { createWishlistAndAddToUser, deleteWishlist, updateWishlist, addStudioToWishlist } from '@services/index';
import { Wishlist } from '@types/index';

export const useCreateWishlistMutation = (userId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (newWishlist) => createWishlistAndAddToUser(userId, newWishlist),
    successMessage: 'Wishlist created',
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }],
    onSuccess: () => navigate('/wishlists')
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
