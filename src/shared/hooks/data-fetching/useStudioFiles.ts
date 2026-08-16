import { useQuery } from '@tanstack/react-query';
import { getStudioFiles } from '@shared/services';

export const useStudioFiles = (studioId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['studioFiles', studioId],
    staleTime: 1 * 60 * 1000,
    queryFn: () => getStudioFiles(studioId),
    enabled: !!studioId
  });

  return {
    files: data?.files || [],
    isLoading,
    error,
    refetch
  };
};
