import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@shared/services';

interface UseProjectMessagesParams {
  projectId: string;
  page?: number;
  limit?: number;
  since?: string;
}

export const useProjectMessages = ({
  projectId,
  page = 1,
  limit = 50,
  since,
}: UseProjectMessagesParams) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['projectMessages', projectId, page, limit, since],
    staleTime: 30 * 1000, // 30 seconds - messages should be fairly fresh
    queryFn: () => getMessages(projectId, { page, limit, since }),
    enabled: !!projectId,
    refetchInterval: 30 * 1000, // Poll for new messages every 30 seconds
  });

  return {
    messages: data?.messages || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
