import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemById } from '../../services/item-service';
import { Item } from '../../types/index';

export const useItem = (itemId:string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['item', itemId],
    queryFn: () => getItemById(itemId),
    initialData: () => queryClient.getQueryData<Item>(['item', itemId]),
  });

  return { data, isLoading, error, refetch };
};
