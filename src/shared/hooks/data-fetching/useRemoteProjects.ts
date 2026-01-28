import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProjects } from '@shared/services';
import { RemoteProjectStatus } from 'src/types/index';

interface UseRemoteProjectsParams {
  customerId?: string;
  vendorId?: string;
  studioId?: string;
  status?: RemoteProjectStatus;
  page?: number;
  limit?: number;
}

export const useRemoteProjects = (params: UseRemoteProjectsParams = {}) => {
  const { customerId, vendorId, studioId, status, page = 1, limit = 20 } = params;

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['remoteProjects', { customerId, vendorId, studioId, status, page, limit }],
    staleTime: 2 * 60 * 1000, // 2 minutes
    queryFn: () => getProjects({ customerId, vendorId, studioId, status, page, limit }),
    placeholderData: keepPreviousData,
    enabled: !!(customerId || vendorId || studioId), // At least one filter required
  });

  return {
    projects: data?.projects || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
