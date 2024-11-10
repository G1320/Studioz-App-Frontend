import { QueryClient } from '@tanstack/react-query';

export const invalidateItemQueries = (queryClient: QueryClient, itemId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['item', { targetId: itemId }, ['items']]
  });

  queryClient.invalidateQueries({
    queryKey: ['items']
  });
};
