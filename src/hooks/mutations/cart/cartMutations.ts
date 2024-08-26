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
import { Cart, CartItem } from '../../../../../shared/types';

export const useAddItemToCartMutation = () => {
  const user = getLocalUser();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { setOfflineCartContext } = useOfflineCartContext();
  
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
  };
  
  return useMutation<Cart,Error,string>({
    mutationFn:async(itemId) => {
      if (user && user._id) {
        return addItemToCart(user?._id, itemId);
      }
      
      const cart = getLocalOfflineCart() || { items: [] };
      cart.items.push(itemId);
      setLocalOfflineCart(cart);
      setOfflineCartContext(cart);
      return cart;
    },
    onSuccess: (_data, variables) => {
      invalidateQueries();
      toast.success('Item added to cart', {
        action: {
          label: 'Undo',
          onClick: () => {
            if (user && user._id) {
              return removeItemFromCart(user?._id, variables)
                .then(() => invalidateQueries())
                .catch((error) => handleError(error));
            }
            const cart = getLocalOfflineCart() || { items: [] };
            const index = cart.items.findIndex((item:string) => item === variables);
            if (index !== -1) {
              const updatedCart = { items: [...cart?.items.slice(0, index), ...cart?.items.slice(index + 1)] };
              setLocalOfflineCart(updatedCart);
              setOfflineCartContext(updatedCart);
              return updatedCart;
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
    queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
  };

  return useMutation<Cart,Error,Cart>({
    mutationFn: (newItems) => {
      if (user && user._id) {
        return addItemsToCart(user?._id, newItems.items)
      }
      throw new Error('User must be logged in to add items to the cart.');
    },
    onSuccess: (_data, variables) => {
      invalidateQueries();
      toast.success('Item added to cart', {
        action: {
          label: 'Undo',
          onClick: () => {
            if (user && user._id) {
              removeItemsFromCart(user._id, variables.items)
                .then(() => invalidateQueries())
                .catch((error) => handleError(error));
            }
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
  const { setOfflineCartContext } = useOfflineCartContext();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
  };

  return useMutation<Cart, Error, string>({
    mutationFn: async (itemId) => {
      if (user && user._id) {
        return removeItemFromCart(user?._id, itemId);
      }
      const cart = getLocalOfflineCart() || { items: [] };
      const itemIndex = cart.items.findIndex((item: string) => item === itemId);
      if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
      }
      
      setLocalOfflineCart({ items: cart.items });
      setOfflineCartContext({ items: cart.items });
      return { items: cart.items };
    },
    onSuccess: (_data, variables) => {
      invalidateQueries();
      toast.success('Item removed from cart', {
        action: {
          label: 'Undo',
          onClick: () => {
            if (user && user._id) {
              return addItemToCart(user._id, variables)
                .then(() => invalidateQueries())
                .catch((error) => handleError(error));
            }
            const cart = getLocalOfflineCart() || { items: [] };
            cart.items.push(variables);
            setLocalOfflineCart(cart);
            setOfflineCartContext(cart);
            return cart;
          },
        },
      });
    },
    onError: (error) => handleError(error),
  });
};

export const useDeleteUserCartMutation = () => {
  const user = getLocalUser()  ;
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { setOfflineCartContext } = useOfflineCartContext();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['cart', user?._id] });
  };

  return useMutation<CartItem[] | [], Error>({
    mutationFn: async () => {
      if (user && user._id) {
        const deletedItems = await deleteUserCart(user?._id);
        setLocalOfflineCart({items:[]});
        setOfflineCartContext({items: []});
        return deletedItems
      }
      setLocalOfflineCart({items:[]});
      setOfflineCartContext({items: []});
      return []
    },
    onSuccess: (data, _variables) => {
      invalidateQueries();
      toast.success('Cart cleared', {
        action: {
          label: 'Undo',
          onClick: async () => {
            if (user && user._id) {
             await addItemsToCart(user?._id,  data)
              .then(() => invalidateQueries())
              .catch((error) => handleError(error));
            }
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
    if (user && user._id) {
      queryClient.invalidateQueries({ queryKey: ['cart', user._id] });
    }
  };

  return useMutation<Cart, Error, Cart>({
    mutationFn: async (newCart) => {
      if (user && user._id) {
        return await updateUserCart(user._id, newCart);
      } else {
        throw new Error('User is not authenticated');
      }
    },
    onSuccess: (_data, _variables) => {
      invalidateQueries();
      toast.success('Cart updated');
    },
    onError: (error) => handleError(error),
  });
};

