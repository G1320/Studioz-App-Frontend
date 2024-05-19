import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getStudioById } from '../../services/studio-service';

export const useStudio = (studioId) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studio', studioId],
    queryFn: () => getStudioById(studioId),
    initialData: () => queryClient.getQueryData(['studio', studioId]),
  });

  return { data, isLoading, error, refetch };
};
