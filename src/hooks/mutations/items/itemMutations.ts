import * as itemService from '../../../services/item-service';

import { useNavigate } from 'react-router-dom';
import { useInvalidateQueries } from '../../utils/useInvalidateQueries';
import { useMutationHandler } from '../../utils/useMutationHandler';
import { Item } from '../../../types/index';

export const useCreateItemMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Item, Item>({
    mutationFn: (newItem) => itemService.createItem(newItem),
    successMessage: 'Item created',
    invalidateQueries: [
      { queryKey: 'items' },
      { queryKey: 'studio', targetId: studioId },
    ],
    undoAction: (_variables, data) => itemService.deleteItem(data._id),
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
    mutationFn: (itemId) => itemService.deleteItem(itemId),
    successMessage: 'Item deleted',
    invalidateQueries: [], 
    undoAction: (_variables, data) => itemService.createItem(data),
    onSuccess: (data, _variables) => {
      invalidateQueries(data);
      navigate(`/studio/${data.studioId}`);
    },
  });
};

export const useUpdateItemMutation = (itemId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Item, Item>({
    mutationFn: (newItem) => itemService.updateItem(itemId, newItem),
    successMessage: 'Item updated',
    invalidateQueries: [{ queryKey: 'items' }],
    undoAction: (_variables, data) => itemService.updateItem(itemId, data),
    onSuccess: (data, _variables) => navigate(`/studio/${data.studioId}`),

  });
};

export const useAddItemToStudioMutation = (studioId: string) => {
  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => itemService.addItemToStudio(studioId, itemId),
    successMessage: 'Item added to studio',
    invalidateQueries: [{ queryKey: 'studioItems', targetId: studioId }],
    undoAction: (variables, _data) => itemService.removeItemFromStudio(studioId, variables),
  });
};

export const useRemoveItemFromStudioMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => itemService.removeItemFromStudio(studioId, itemId),
    successMessage: 'Item removed from studio',
    invalidateQueries: [{ queryKey: 'studioItems', targetId: studioId }],
    undoAction: (variables, _data) => itemService.addItemToStudio(studioId, variables),
    onSuccess: () => navigate(`/studio/${studioId}`),
  });
};

export const useAddItemToWishlistMutation = (itemId: string) => {
  const invalidateQueries = useInvalidateQueries<string>((wishlistId) => [
    { queryKey: 'wishlistItems', targetId: wishlistId },
  ]);

  return useMutationHandler<Item, string>({
    mutationFn: (wishlistId) => itemService.addItemToWishlist(wishlistId, itemId),
    successMessage: 'Item added to wishlist',
    invalidateQueries: [],
    undoAction: async (variables, _data) => {
      invalidateQueries(variables)
      return await itemService.removeItemFromWishlist(variables, itemId);
    },
    onSuccess: (_data, variables) => invalidateQueries(variables)
  });
};

export const useRemoveItemFromWishlistMutation = (wishlistId: string) => {
  return useMutationHandler<Item, string>({
    mutationFn: (itemId) => itemService.removeItemFromWishlist(wishlistId, itemId),
    successMessage: 'Item removed from wishlist',
    invalidateQueries: [{ queryKey: 'wishlistItems', targetId: wishlistId }],
    undoAction: (variables, _data) => itemService.addItemToWishlist(wishlistId, variables),
  });
};