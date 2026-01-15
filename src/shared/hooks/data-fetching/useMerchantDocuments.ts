import { useQuery } from '@tanstack/react-query';
import { getMerchantDocuments, GetDocumentsParams, MerchantDocumentsResponse } from '@shared/services';
import { useUserContext } from '@core/contexts';

interface UseMerchantDocumentsOptions {
  page?: number;
  limit?: number;
  status?: 'paid' | 'pending' | 'overdue' | 'draft' | 'all';
  studioId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

// Empty response for when there's no data
const EMPTY_RESPONSE: MerchantDocumentsResponse = {
  documents: [],
  stats: {
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalDocs: 0
  },
  pagination: { total: 0, page: 1, limit: 50, pages: 0 }
};

/**
 * Hook to fetch merchant documents (invoices, receipts, etc.)
 * Always uses real data from the API
 */
export const useMerchantDocuments = (options: UseMerchantDocumentsOptions = {}) => {
  const { user } = useUserContext();
  const {
    page = 1,
    limit = 50,
    status,
    studioId,
    search,
    startDate,
    endDate,
    enabled = true
  } = options;

  const params: GetDocumentsParams = {
    userId: user?._id || '',
    page,
    limit,
    status,
    studioId,
    search,
    startDate,
    endDate
  };

  const query = useQuery({
    queryKey: ['merchantDocuments', params],
    queryFn: () => getMerchantDocuments(params),
    enabled: !!user?._id && enabled,
    staleTime: 1000 * 60 * 1, // 1 minute - shorter stale time for fresher data
    retry: 1
  });

  return {
    data: query.data || EMPTY_RESPONSE,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isDemo: false // Always using real data now
  };
};
