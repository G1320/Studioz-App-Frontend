import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '../../services/item-service';

export const useItems = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items', {}],
    queryFn: () => getItems(),
    initialData: () => queryClient.getQueryData(['items']),
  });

  return { data, isLoading, error, refetch };
};
