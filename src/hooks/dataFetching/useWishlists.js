import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserWishlists } from '../../services/wishlist-service';

export const useWishlists = (userId) => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['wishlists', userId],
    queryFn: () => getUserWishlists(userId),
    enabled: !!userId,
    initialData: () => queryClient.getQueryData(['wishlists', userId]),
  });

  return { data, refetch };
};
