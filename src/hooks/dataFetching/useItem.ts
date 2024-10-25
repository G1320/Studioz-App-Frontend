import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemById } from '@/services/index';
import { Item } from '@/types/index';

export const useItem = (itemId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['item', itemId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => getItemById(itemId),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Item>(['item', itemId])
  });

  return { data, isLoading, error, refetch };
};
