import { QueryClient } from '@tanstack/react-query';

export const invalidateItemQueries = (queryClient: QueryClient, itemId: string) => {
  // Invalidate specific item
  console.log('Invalidating item:', itemId);
  queryClient.invalidateQueries({
    queryKey: ['item', { targetId: itemId }, ['items']]
  });

  // Invalidate items list
  queryClient.invalidateQueries({
    queryKey: ['items']
  });
};
