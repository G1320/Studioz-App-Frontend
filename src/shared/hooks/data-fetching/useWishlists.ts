import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWishlists } from '@shared/services';
import { Wishlist } from 'src/types/index';

export const useWishlists = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['wishlists', userId],
    queryFn: () => getWishlists(userId),
    enabled: !!userId,
    initialData: () => queryClient.getQueryData<Wishlist[]>(['wishlists', userId])
  });

  return { data, refetch };
};
