import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserWishlistById } from '../../services/wishlist-service';

export const useWishlistItems = (userId, wishlistId) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['wishlistItems', wishlistId],
    queryFn: () => getUserWishlistById(userId, wishlistId),
    enabled: !!wishlistId,
    initialData: () => queryClient.getQueryData(['wishlistItems', wishlistId]),
  });

  return { data, isLoading, error, refetch };
};
