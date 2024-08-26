import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '../../services/item-service';
import { Item } from '../../../../shared/types';

export const useItems = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items', {}],
    queryFn: () => getItems(),
    initialData: () => queryClient.getQueryData<Item[]>(['items']),
  });

  return { data, isLoading, error, refetch };
};
