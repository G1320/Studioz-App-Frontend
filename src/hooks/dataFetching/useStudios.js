import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudios } from '../../services/studio-service';

export const useStudios = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studios', {}],
    queryFn: () => getStudios(),
    initialData: () => queryClient.getQueryData(['studios']),
  });

  return { data, isLoading, error, refetch };
};
