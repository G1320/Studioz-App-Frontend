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

import { toast } from 'sonner';

export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  return useMutation({
    mutationFn: (newItem) => createItem(newItem),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['items']);
      toast.success('Item created', {
        action: {
          label: 'Undo',
          onClick: () => {
            deleteItem(data._id)
              .then(() => queryClient.invalidateQueries(['items']))
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
    queryClient.invalidateQueries(['item', variables]);
    queryClient.invalidateQueries(['items']);
  };

  return useMutation({
    mutationFn: (itemId) => deleteItem(itemId),
    onSuccess: (data, variables) => {
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

export const useUpdateItemMutation = (itemId) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['item', itemId]);
    queryClient.invalidateQueries(['items']);
  };

  return useMutation({
    mutationFn: (newItem) => updateItem(itemId, newItem),
    onSuccess: (data, variables) => {
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

export const useAddItemToStudioMutation = (studioId) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['studioItems', studioId]);
    queryClient.invalidateQueries(['studio', studioId]);
  };

  return useMutation({
    mutationFn: (itemId) => addItemToStudio(studioId, itemId),
    onSuccess: (data, variables) => {
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

export const useRemoveItemFromStudioMutation = (studioId) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['studioItems', studioId]);
    queryClient.invalidateQueries(['studio', studioId]);
  };

  return useMutation({
    mutationFn: (itemId) => removeItemFromStudio(studioId, itemId),
    onSuccess: (data, variables) => {
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

export const useAddItemToWishlistMutation = (itemId) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = (variables) => {
    queryClient.invalidateQueries(['wishlistItems', variables]);
    queryClient.invalidateQueries(['wishlist', variables]);
  };

  return useMutation({
    mutationFn: (wishlistId) => addItemToWishlist(wishlistId, itemId),
    onSuccess: (data, variables) => {
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

export const useRemoveItemFromWishlistMutation = (wishlistId) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['wishlistItems', wishlistId]);
    queryClient.invalidateQueries(['wishlist', wishlistId]);
  };

  return useMutation({
    mutationFn: (itemId) => removeItemFromWishlist(wishlistId, itemId),
    onSuccess: (data, variables) => {
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
