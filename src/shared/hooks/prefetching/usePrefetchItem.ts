import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getItemById } from '@shared/services';

export const usePrefetchItem = (itemId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['item', itemId],
      queryFn: () => getItemById(itemId)
    });
  }, [queryClient, itemId]);
};
