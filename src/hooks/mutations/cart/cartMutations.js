import { useMutation, useQueryClient } from '@tanstack/react-query';
import useErrorHandling from '../../ErrorAndSuccessHandling/useErrorHandling';
import {
  addItemToCart,
  removeItemFromCart,
  deleteUserCart,
  updateUserCart,
  addItemsToCart,
  removeItemsFromCart,
  getLocalOfflineCart,
  setLocalOfflineCart,
} from '../../../services/cart-service';

import { toast } from 'sonner';
import { getLocalUser } from '../../../services/user-service';
import { useOfflineCartContext } from '../../../contexts/OfflineCartContext';

export const useAddItemToCartMutation = () => {
  const user = getLocalUser();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { offlineCart, setOfflineCart } = useOfflineCartContext();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['cart', user?._id]);
  };

  return useMutation({
    mutationFn: (item) => {
      if (user) {
        return addItemToCart(user?._id, item);
      } else {
        const cart = getLocalOfflineCart() || [];
        cart.push(item);
        setLocalOfflineCart(cart);
        return cart;
      }
    },
    onSuccess: (data, variables) => {
      invalidateQueries();
      toast.success('Item added to cart', {
        action: {
          label: 'Undo',
          onClick: () => {
            if (user) {
              return removeItemFromCart(user?._id, variables)
                .then(() => invalidateQueries())
                .catch((error) => handleError(error));
            } else {
              const cart = getLocalOfflineCart() || [];
              const index = cart.findIndex((item) => item === variables);
              if (index !== -1) {
                const updatedCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
                setLocalOfflineCart(updatedCart);
                setOfflineCart(updatedCart);
                return updatedCart;
              }
            }
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useAddItemsToCartMutation = () => {
  const user = getLocalUser();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['cart', user?._id]);
  };

  return useMutation({
    mutationFn: (newItems) => addItemsToCart(user?._id, newItems),
    onSuccess: (data, variables) => {
      invalidateQueries();
      toast.success('Item added to cart', {
        action: {
          label: 'Undo',
          onClick: () => {
            removeItemsFromCart(user?._id, variables)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useRemoveItemFromCartMutation = () => {
  const user = getLocalUser();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { offlineCart, setOfflineCart } = useOfflineCartContext();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['cart', user?._id]);
  };

  return useMutation({
    mutationFn: (itemId) => {
      if (user) {
        return removeItemFromCart(user?._id, itemId);
      } else {
        const cart = getLocalOfflineCart() || [];
        const index = cart.findIndex((item) => item === itemId);
        if (index !== -1) {
          const updatedCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
          setLocalOfflineCart(updatedCart);
          setOfflineCart(updatedCart);
          return updatedCart;
        }
      }
    },
    onSuccess: (data, variables) => {
      invalidateQueries();
      toast.success('Item removed from cart', {
        action: {
          label: 'Undo',
          onClick: () => {
            addItemToCart(user._id, variables)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useDeleteUserCartMutation = () => {
  const user = getLocalUser();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['cart', user._id]);
  };

  return useMutation({
    mutationFn: () => deleteUserCart(user._id),
    onSuccess: (data, variables) => {
      invalidateQueries();
      toast.success('Cart cleared', {
        action: {
          label: 'Undo',
          onClick: () => {
            addItemsToCart(user._id, data)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateCartMutation = () => {
  const user = getLocalUser();
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['cart', user._id]);
  };

  return useMutation({
    mutationFn: (newCart) => updateUserCart(user._id, newCart),
    onSuccess: (data, variables) => {
      invalidateQueries();
      toast.success('Cart updated');
    },
    onError: (error) => handleError(error),
  });
};
