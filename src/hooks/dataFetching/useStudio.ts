import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudioById } from '@/services/studio-service';
import { StudioResponse } from '@/types/index';

export const useStudio = (studioId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery<StudioResponse>({
    queryKey: ['studio', studioId],
    queryFn: () => getStudioById(studioId),
    initialData: () => queryClient.getQueryData<StudioResponse>(['studio', studioId]),
  });

  return { data, isLoading, error, refetch };
};
