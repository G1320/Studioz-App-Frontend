import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserCart } from '../../services/cart-service';
import {  Item } from '../../types/index';

export const useCart = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cart', userId],
    enabled: !!userId,
    queryFn: () => getUserCart(userId),
    initialData: () => queryClient.getQueryData<Item[]>(['cart', userId]),
  });
  return { data, isLoading, error, refetch };
};
