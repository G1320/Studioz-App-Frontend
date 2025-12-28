import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '@shared/services';
import { Item } from 'src/types/index';

export const useItems = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items'],
    staleTime: 15 * 60 * 1000, // 15 minutes - longer for better performance
    gcTime: 60 * 60 * 1000, // 1 hour - keep in memory cache longer
    queryFn: () => getItems(),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Item[]>(['items'])
  });

  return { data, isLoading, error, refetch };
};
