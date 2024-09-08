import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWishlists } from '../../services/wishlist-service';
import { Wishlist } from '../../types/index';

export const useWishlists = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['wishlists', userId],
    queryFn: () => getWishlists(userId),
    enabled: !!userId,
    initialData: () => queryClient.getQueryData<Wishlist[]>(['wishlists', userId]),
  });

  return { data, refetch };
};
