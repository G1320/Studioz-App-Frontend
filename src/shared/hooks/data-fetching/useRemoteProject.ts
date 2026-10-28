import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjectById } from '@shared/services';
import { ProjectDetailResponse } from 'src/types/index';

export const useRemoteProject = (projectId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['remoteProject', projectId],
    staleTime: 2 * 60 * 1000, // 2 minutes
    queryFn: () => getProjectById(projectId),
    placeholderData: keepPreviousData,
    initialData: () =>
      queryClient.getQueryData<ProjectDetailResponse>(['remoteProject', projectId]),
    enabled: !!projectId,
    retry: (failureCount, err) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403 || status === 404) return false;
      return failureCount < 3;
    },
  });

  return {
    project: data?.project,
    fileCounts: data?.fileCounts,
    access: data?.access,
    deliverablesLocked: data?.deliverablesLocked ?? false,
    isLoading,
    error,
    refetch,
  };
};
