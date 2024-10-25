import { getStudioById } from '@/services/index';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const usePrefetchStudio = (studioId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['studio', studioId],
      queryFn: () => getStudioById(studioId)
    });
  }, [queryClient, studioId]);
};
