import { useQuery } from '@tanstack/react-query';
import { getProjectFiles } from '@shared/services';
import { ProjectFileType } from 'src/types/index';

interface UseProjectFilesParams {
  projectId: string;
  type?: ProjectFileType;
}

export const useProjectFiles = ({ projectId, type }: UseProjectFilesParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projectFiles', projectId, type],
    staleTime: 1 * 60 * 1000, // 1 minute
    queryFn: () => getProjectFiles(projectId, type),
    enabled: !!projectId,
  });

  return {
    files: data?.files || [],
    isLoading,
    error,
    refetch,
  };
};
