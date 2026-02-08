import { getStudioById } from '@shared/services/index';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const usePrefetchStudio = (studioId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient
      .prefetchQuery({
        queryKey: ['studio', studioId],
        queryFn: () => getStudioById(studioId)
      })
      .catch(() => {
        // Prefetch is best-effort; avoid unhandled rejection (e.g. network errors in Sentry)
      });
  }, [queryClient, studioId]);
};
