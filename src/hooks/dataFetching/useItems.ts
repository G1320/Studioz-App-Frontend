import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '@services/index';
import { Item } from '@models/index';

export const useItems = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items', {}],
    staleTime: 5 * 60 * 1000,
    queryFn: getItems,
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Item[]>(['items'])
  });

  return { data, isLoading, error, refetch };
};
