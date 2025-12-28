import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudios } from '@shared/services';
import { Studio } from 'src/types/index';

export const useStudios = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studios'],
    staleTime: 15 * 60 * 1000, // 15 minutes - longer for better performance
    gcTime: 60 * 60 * 1000, // 1 hour - keep in memory cache longer
    queryFn: () => getStudios(),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Studio[]>(['studios'])
  });

  return { data, isLoading, error, refetch };
};
