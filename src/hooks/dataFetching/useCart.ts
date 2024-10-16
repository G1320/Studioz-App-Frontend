import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserCart } from '@/services';
import { Cart } from '@/types/index';

export const useOnlineCart = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cart', userId],
    enabled: !!userId,
    queryFn: () => getUserCart(userId),
    initialData: () => queryClient.getQueryData<Cart>(['cart', userId])
  });
  return { data, isLoading, error, refetch };
};
