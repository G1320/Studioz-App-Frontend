import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserCart } from '../../services/cart-service';

export const useUserCart = (userId) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cart', userId],
    enabled: !!userId,
    queryFn: () => getUserCart(userId),
    initialData: () => queryClient.getQueryData(['cart', userId]),
  });
  return { data, isLoading, error, refetch };
};
