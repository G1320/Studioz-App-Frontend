import { useQueryClient } from '@tanstack/react-query';

type QueryConfig = {
  queryKey: string;
  targetId?: string;
};

export const useInvalidateQueries = <T,>(getQueries: (params?: T) => QueryConfig[]) => {
  const queryClient = useQueryClient();

  return (params?: T) => {
    const queries = getQueries(params);
    queries.forEach(({ queryKey, targetId }) => {
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: [queryKey, targetId] });
      } else {
        queryClient.invalidateQueries({ queryKey: [queryKey, {}] });
      }
    });
  };
};
