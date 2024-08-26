import { useMutation, useQueryClient } from '@tanstack/react-query';
import useErrorHandling from '../../ErrorAndSuccessHandling/useErrorHandling';
import {
  addStudioToWishlist,
  createWishlistAndAddToUser,
  deleteWishlist,
} from '../../../services/wishlist-service';
import { updateWishlist } from '../../../services/wishlist-service';
import { toast } from 'sonner';

import Wishlist from '../../../../../shared/types/wishlist';

export const useCreateWishlistMutation = (userId:string) => {
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<Wishlist, Error, Wishlist>({
    mutationFn: (newWishlist) => createWishlistAndAddToUser(userId, newWishlist),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['wishlists', userId]});
      toast.success('Wishlist created');
    },
    onError: (error) => handleError(error),
  });
};

export const useDeleteWishlistMutation = (userId:string) => {
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<Wishlist,Error, string>({
    mutationFn: (wishlistId) => deleteWishlist(userId, wishlistId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({queryKey:['wishlists', variables]});
      toast.success('Wishlist deleted');
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateWishlistMutation = (wishlistId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey:['wishlist', wishlistId]});
  };

  return useMutation<Wishlist,Error, Wishlist>({
    mutationFn: (newWishlist) => updateWishlist(wishlistId, newWishlist),
    onSuccess: (_data, _variables) => {
      invalidateQueries();
      toast.success('Wishlist updated');
    },
    onError: (error) => handleError(error),
  });
};

export const useAddStudioToWishlistMutation = (studioId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  return useMutation<Wishlist,Error, string>({
    mutationFn: (wishlistId:string) => addStudioToWishlist(studioId, wishlistId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({queryKey:['wishlist', variables]});
      toast.success('Studio added to wishlist');
    },
    onError: (error) => handleError(error),
  });
};
