import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemById } from '../../services/item-service';

export const useItem = (itemId) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['item', itemId],
    queryFn: () => getItemById(itemId),
    initialData: () => queryClient.getQueryData(['item', itemId]),
  });

  return { data, isLoading, error, refetch };
};
