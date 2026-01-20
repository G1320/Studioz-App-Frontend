import { useQuery } from '@tanstack/react-query';
import { getMerchantDocuments, GetDocumentsParams, MerchantDocumentsResponse, MerchantDocument } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { DEMO_DOCUMENTS } from '@core/config/demo';

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

// Convert demo documents to the API format
const convertDemoToApiFormat = (demoDoc: typeof DEMO_DOCUMENTS[0]): MerchantDocument => ({
  id: demoDoc.id,
  externalId: `ext-${demoDoc.id}`,
  number: demoDoc.number,
  type: demoDoc.type,
  studioId: 'demo-studio',
  studioName: demoDoc.studioName,
  amount: demoDoc.amount,
  currency: 'ILS',
  date: demoDoc.date,
  dueDate: demoDoc.dueDate,
  status: demoDoc.status,
  customerName: demoDoc.customerName,
  customerEmail: 'demo@example.com'
});

// Demo response with statistics
const DEMO_RESPONSE: MerchantDocumentsResponse = {
  documents: DEMO_DOCUMENTS.map(convertDemoToApiFormat),
  stats: {
    totalRevenue: 8590, // Sum of paid documents
    pendingAmount: 2550, // Sum of pending documents
    overdueAmount: 1800, // Sum of overdue documents
    totalDocs: DEMO_DOCUMENTS.length
  },
  pagination: { total: DEMO_DOCUMENTS.length, page: 1, limit: 50, pages: 1 }
};

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
 * Falls back to demo data if no real data is available or on error
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

  // Check if we should use demo data
  const hasRealData = query.data && query.data.documents.length > 0;

  return {
    data: hasRealData ? query.data : (query.isError || !query.data ? DEMO_RESPONSE : query.data),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isDemo: !hasRealData
  };
};
