import { QueryClient } from '@tanstack/react-query';

export const invalidateItemQueries = (queryClient: QueryClient, itemId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['item', itemId]
  });
  queryClient.invalidateQueries({
    queryKey: ['items']
  });
};
export const invalidateCartQueries = (queryClient: QueryClient, userId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['cart', userId]
  });
};
