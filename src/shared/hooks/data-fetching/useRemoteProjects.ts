import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProjects } from '@shared/services';
import { RemoteProjectStatus } from 'src/types/index';
import { AxiosError } from 'axios';

interface UseRemoteProjectsParams {
  customerId?: string;
  vendorId?: string;
  participantId?: string;
  studioId?: string;
  status?: RemoteProjectStatus;
  page?: number;
  limit?: number;
  /** When true, fetch the authenticated user's projects (JWT identity) without a participantId filter */
  mine?: boolean;
  enabled?: boolean;
}

export const useRemoteProjects = (params: UseRemoteProjectsParams = {}) => {
  const {
    customerId,
    vendorId,
    participantId,
    studioId,
    status,
    page = 1,
    limit = 20,
    mine = false,
    enabled: enabledOverride
  } = params;

  const hasExplicitFilter = !!(participantId || customerId || vendorId || studioId);
  const enabled =
    enabledOverride !== undefined ? enabledOverride : hasExplicitFilter || mine;

  const { data, isLoading, error, refetch, isFetching, isPlaceholderData, isError } = useQuery({
    queryKey: ['remoteProjects', { customerId, vendorId, participantId, studioId, status, page, limit, mine }],
    staleTime: 2 * 60 * 1000, // 2 minutes
    queryFn: () =>
      getProjects({
        // Prefer JWT identity for "mine" — avoids 403 when local user._id ≠ JWT claim shape
        customerId,
        vendorId,
        participantId: mine ? undefined : participantId,
        studioId,
        status,
        page,
        limit
      }),
    placeholderData: keepPreviousData,
    enabled,
    retry: (failureCount, err) => {
      const statusCode = (err as AxiosError)?.response?.status;
      if (statusCode === 401 || statusCode === 403) return false;
      return failureCount < 2;
    }
  });

  return {
    projects: data?.projects || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch
  };
};
