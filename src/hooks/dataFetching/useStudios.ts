import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudios } from '@services/index';
import { Studio } from '@types/index';

export const useStudios = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studios', {}],
    staleTime: 5 * 60 * 1000,
    queryFn: getStudios,
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<Studio[]>(['studios'])
  });

  return { data, isLoading, error, refetch };
};
