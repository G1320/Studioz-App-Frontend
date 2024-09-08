
import { useNavigate } from 'react-router-dom';
import { useMutationHandler } from '../../utils/useMutationHandler';
import { useInvalidateQueries } from '../../utils/useInvalidateQueries';
import * as wishlistService from '../../../services/wishlist-service';
import {Wishlist} from '../../../types/index';

export const useCreateWishlistMutation = (userId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (newWishlist) => wishlistService.createWishlistAndAddToUser(userId, newWishlist),
    successMessage: 'Wishlist created',
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }],
    onSuccess: () => navigate('/wishlists'),
  });
};

export const useDeleteWishlistMutation = (userId: string) => {
  return useMutationHandler<Wishlist, string>({
    mutationFn: (wishlistId) => wishlistService.deleteWishlist(userId, wishlistId),
    successMessage: 'Wishlist deleted',
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }],
  });
};

export const useUpdateWishlistMutation = (wishlistId: string) => {
  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (updatedWishlist) => wishlistService.updateWishlist(wishlistId, updatedWishlist),
    successMessage: 'Wishlist updated',
    invalidateQueries: [{ queryKey: 'wishlist', targetId: wishlistId }],
  });
};

export const useAddStudioToWishlistMutation = (studioId: string) => {
  const invalidateQueries = useInvalidateQueries<string>((wishlistId) => [
    { queryKey: 'wishlistItems', targetId: wishlistId },
  ]);

  return useMutationHandler<Wishlist, string>({
    mutationFn: (wishlistId) => wishlistService.addStudioToWishlist(studioId, wishlistId),
    successMessage: 'Studio added to wishlist',
    invalidateQueries: [], 
    onSuccess: (_data, variables) => invalidateQueries(variables),
  });
};
