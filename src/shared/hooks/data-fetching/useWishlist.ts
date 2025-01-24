import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserWishlistById } from '@shared/services';
import { WishlistResponse } from 'src/types/index';

export const useWishlist = (userId: string, wishlistId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery<WishlistResponse>({
    queryKey: ['wishlistItems', wishlistId],
    queryFn: () => getUserWishlistById(userId, wishlistId),
    enabled: !!wishlistId,
    initialData: () => queryClient.getQueryData<WishlistResponse>(['wishlistItems', wishlistId])
  });

  return { data, isLoading, error, refetch };
};
