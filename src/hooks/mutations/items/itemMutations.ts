import { useMutation, useQueryClient } from '@tanstack/react-query';
import useErrorHandling from '../../ErrorAndSuccessHandling/useErrorHandling';
import {
  createItem,
  addItemToStudio,
  addItemToWishlist,
  deleteItem,
  updateItem,
  removeItemFromStudio,
  removeItemFromWishlist,
} from '../../../services/item-service';

import { Item } from '../../../../../shared/types';
import { toast } from 'sonner';

export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  return useMutation<Item,Error,Item>({
    mutationFn: (newItem) => createItem(newItem),
    onSuccess: (data, _variables) => {
      queryClient.invalidateQueries({queryKey:['items']});
      toast.success('Item created', {
        action: {
          label: 'Undo',
          onClick: () => {
            deleteItem(data._id)
              .then(() => queryClient.invalidateQueries({queryKey:['items']}))
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    // queryClient.invalidateQueries({queryKey:['item', variables]});
    queryClient.invalidateQueries({queryKey:['item']});
    queryClient.invalidateQueries({queryKey:['items']});
  };

  return useMutation<Item, Error, string>({
    mutationFn: (itemId:string) => deleteItem(itemId),
    onSuccess: (data, _variables) => {
      invalidateQueries();
      toast.success('Item deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            createItem(data)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateItemMutation = (itemId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey:['item', itemId]});
    queryClient.invalidateQueries({queryKey:['items']});
  };

  return useMutation<Item, Error, Item>({
    mutationFn: (newItem) => updateItem(itemId, newItem),
    onSuccess: (data, _variables) => {
      invalidateQueries();
      toast.success('Item updated', {
        action: {
          label: 'Undo',
          onClick: () => {
            updateItem(itemId, data)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useAddItemToStudioMutation = (studioId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey:['studioItems', studioId]});
    queryClient.invalidateQueries({queryKey:['studio', studioId]});
  };

  return useMutation<Item, Error, string>({
    mutationFn: (itemId) => addItemToStudio(studioId, itemId),
    onSuccess: (_data, variables) => {
      invalidateQueries();
      toast.success('Item added to studio', {
        action: {
          label: 'Undo',
          onClick: () => {
            removeItemFromStudio(studioId, variables)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useRemoveItemFromStudioMutation = (studioId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey:['studioItems', studioId]});
    queryClient.invalidateQueries({queryKey:['studio', studioId]});
  };

  return useMutation<Item, Error, string>({
    mutationFn: (itemId) => removeItemFromStudio(studioId, itemId),
    onSuccess: (_data, variables) => {
      invalidateQueries();
      toast.success('Item removed from studio', {
        action: {
          label: 'Undo',
          onClick: () => {
            addItemToStudio(studioId, variables)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useAddItemToWishlistMutation = (itemId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = (variables:string) => {
    queryClient.invalidateQueries({queryKey:['wishlistItems', variables]});
    queryClient.invalidateQueries({queryKey:['wishlist', variables]});
  };

  return useMutation<Item, Error, string>({
    mutationFn: (wishlistId) => addItemToWishlist(wishlistId, itemId),
    onSuccess: (_data, variables) => {
      invalidateQueries(variables);
      toast.success('Item added to wishlist', {
        action: {
          label: 'Undo',
          onClick: () => {
            removeItemFromWishlist(variables, itemId)
              .then(() => invalidateQueries(variables))
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useRemoveItemFromWishlistMutation = (wishlistId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey:['wishlistItems', wishlistId]});
    queryClient.invalidateQueries({queryKey:['wishlist', wishlistId]});
  };

  return useMutation<Item, Error, string>({
    mutationFn: (itemId) => removeItemFromWishlist(wishlistId, itemId),
    onSuccess: (_data, variables) => {
      invalidateQueries();
      toast.success('Item removed from wishlist', {
        action: {
          label: 'Undo',
          onClick: () => {
            addItemToWishlist(wishlistId, variables)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};
