import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getStudioItems } from '../../services/studio-service';

export const useStudioItems = (studioId) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studioItems', studioId],
    queryFn: () => getStudioItems(studioId),
    placeholderData: () => queryClient.getQueryData(['studioItems', studioId]),
  });

  return { data, isLoading, error, refetch };
};
