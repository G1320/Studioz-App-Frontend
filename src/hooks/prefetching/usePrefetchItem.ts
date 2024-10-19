import { getItemById } from '@/services';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const usePrefetchItem = (itemId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['item', itemId],
      queryFn: () => getItemById(itemId)
    });
  }, [queryClient, itemId]);
};
