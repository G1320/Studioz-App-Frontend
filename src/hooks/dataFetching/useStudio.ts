import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudioById } from '@services/index';
import { StudioResponse } from 'src/types/index';

export const useStudio = (studioId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery<StudioResponse>({
    queryKey: ['studio', studioId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => getStudioById(studioId),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<StudioResponse>(['studio', studioId])
  });

  return { data, isLoading, error, refetch };
};
