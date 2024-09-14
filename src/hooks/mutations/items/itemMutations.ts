import { useNavigate } from 'react-router-dom';
import { useInvalidateQueries, useMutationHandler } from '@/hooks/utils';
import { 
  createItem, deleteItem, updateItem, addItemToWishlist, 
  removeItemFromWishlist, addItemToStudio, removeItemFromStudio
 } from '@/services';
import { Item } from '@/types/index';

export const useCreateItemMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Item, Item>({
    mutationFn: (newItem) => createItem(newItem),
    successMessage: 'Item created',
    invalidateQueries: [
      { queryKey: 'items' },
      { queryKey: 'studio', targetId: studioId },
    ],
    undoAction: (_variables, data) => deleteItem(data._id),
    onSuccess: () => navigate(`/studio/${studioId}`),
  });
};

export const useDeleteItemMutation = () => {
  const navigate = useNavigate();

  const invalidateQueries = useInvalidateQueries<Item>((item) => [
    { queryKey: 'items' },
    { queryKey: 'studios' },
    { queryKey: 'studio', targetId: item?.studioId },
  ]);

  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => deleteItem(itemId),
    successMessage: 'Item deleted',
    invalidateQueries: [], 
    undoAction: (_variables, data) => createItem(data),
    onSuccess: (data, _variables) => {
      invalidateQueries(data);
      navigate(`/studio/${data.studioId}`);
    },
  });
};

export const useUpdateItemMutation = (itemId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Item, Item>({
    mutationFn: (newItem) => updateItem(itemId, newItem),
    successMessage: 'Item updated',
    invalidateQueries: [{ queryKey: 'items' }],
    undoAction: (_variables, data) => updateItem(itemId, data),
    onSuccess: (data, _variables) => navigate(`/studio/${data.studioId}`),

  });
};

export const useAddItemToStudioMutation = (studioId: string) => {
  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => addItemToStudio(studioId, itemId),
    successMessage: 'Item added to studio',
    invalidateQueries: [{ queryKey: 'studioItems', targetId: studioId }],
    undoAction: (variables, _data) => removeItemFromStudio(studioId, variables),
  });
};

export const useRemoveItemFromStudioMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => removeItemFromStudio(studioId, itemId),
    successMessage: 'Item removed from studio',
    invalidateQueries: [{ queryKey: 'studioItems', targetId: studioId }],
    undoAction: (variables, _data) => addItemToStudio(studioId, variables),
    onSuccess: () => navigate(`/studio/${studioId}`),
  });
};

export const useAddItemToWishlistMutation = (itemId: string) => {
  const invalidateQueries = useInvalidateQueries<string>((wishlistId) => [
    { queryKey: 'wishlistItems', targetId: wishlistId },
  ]);

  return useMutationHandler<Item, string>({
    mutationFn: (wishlistId) => addItemToWishlist(wishlistId, itemId),
    successMessage: 'Item added to wishlist',
    invalidateQueries: [],
    undoAction: async (variables, _data) => {
      invalidateQueries(variables)
      return await removeItemFromWishlist(variables, itemId);
    },
    onSuccess: (_data, variables) => invalidateQueries(variables)
  });
};

export const useRemoveItemFromWishlistMutation = (wishlistId: string) => {
  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => removeItemFromWishlist(wishlistId, itemId),
    successMessage: 'Item removed from wishlist',
    invalidateQueries: [{ queryKey: 'wishlistItems', targetId: wishlistId }],
    undoAction: (variables, _data) => addItemToWishlist(wishlistId, variables),
  });
};