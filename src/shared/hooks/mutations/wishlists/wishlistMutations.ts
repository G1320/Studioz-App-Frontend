import { useMutationHandler, useInvalidateQueries, useLanguageNavigate } from '@shared/hooks';
import { createWishlistAndAddToUser, deleteWishlist, updateWishlist, addStudioToWishlist } from '@shared/services';
import { Wishlist } from 'src/types/index';
import { useTranslation } from 'react-i18next';

export const useCreateWishlistMutation = (userId: string) => {
  const languageNavigate = useLanguageNavigate();
  const { t } = useTranslation('common');

  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (newWishlist) => createWishlistAndAddToUser(userId, newWishlist),
    successMessage: t('toasts.success.wishlistCreated'),
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }],
    onSuccess: () => languageNavigate('/wishlists')
  });
};

export const useDeleteWishlistMutation = (userId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<Wishlist, string>({
    mutationFn: (wishlistId) => deleteWishlist(userId, wishlistId),
    successMessage: t('toasts.success.wishlistDeleted'),
    invalidateQueries: [{ queryKey: 'wishlists', targetId: userId }]
  });
};

export const useUpdateWishlistMutation = (wishlistId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<Wishlist, Wishlist>({
    mutationFn: (updatedWishlist) => updateWishlist(wishlistId, updatedWishlist),
    successMessage: t('toasts.success.wishlistUpdated'),
    invalidateQueries: [{ queryKey: 'wishlist', targetId: wishlistId }]
  });
};

export const useAddStudioToWishlistMutation = (studioId: string) => {
  const { t } = useTranslation('common');

  const invalidateQueries = useInvalidateQueries<string>((wishlistId) => [
    { queryKey: 'wishlistItems', targetId: wishlistId }
  ]);

  return useMutationHandler<Wishlist, string>({
    mutationFn: (wishlistId) => addStudioToWishlist(studioId, wishlistId),
    successMessage: t('toasts.success.studioAddedToWishlist'),
    invalidateQueries: [],
    onSuccess: (_data, variables) => invalidateQueries(variables)
  });
};
