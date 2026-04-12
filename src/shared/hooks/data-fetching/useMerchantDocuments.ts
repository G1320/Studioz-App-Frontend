import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMerchantDocuments, GetDocumentsParams, MerchantDocumentsResponse, MerchantDocument, DocStatus } from '@shared/services';
import { useUserContext } from '@core/contexts';
import { DEMO_DOCUMENTS, DEMO_USER_ID } from '@core/config/demo';
import dayjs from 'dayjs';

interface UseMerchantDocumentsOptions {
  page?: number;
  limit?: number;
  status?: DocStatus | 'all';
  studioId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

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

const ALL_DEMO_DOCS = DEMO_DOCUMENTS.map(convertDemoToApiFormat);

/**
 * Hook to fetch merchant documents (invoices, receipts, etc.)
 * TEMP: Uses demo data with client-side filtering
 * TODO: Switch to real API when ready
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
    staleTime: 1000 * 60 * 1,
    retry: 1
  });

  // Client-side filtered demo data
  const demoResponse = useMemo((): MerchantDocumentsResponse => {
    let docs = ALL_DEMO_DOCS;

    if (status && status !== 'all') {
      docs = docs.filter((d) => d.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.customerName.toLowerCase().includes(q) ||
          d.number.toLowerCase().includes(q) ||
          d.studioName.toLowerCase().includes(q)
      );
    }

    if (startDate) {
      docs = docs.filter((d) => dayjs(d.date).isSame(dayjs(startDate), 'day') || dayjs(d.date).isAfter(dayjs(startDate)));
    }
    if (endDate) {
      docs = docs.filter((d) => dayjs(d.date).isSame(dayjs(endDate), 'day') || dayjs(d.date).isBefore(dayjs(endDate)));
    }

    const paidDocs = ALL_DEMO_DOCS.filter((d) => d.status === 'paid');
    const pendingDocs = ALL_DEMO_DOCS.filter((d) => d.status === 'pending');
    const overdueDocs = ALL_DEMO_DOCS.filter((d) => d.status === 'overdue');

    return {
      documents: docs,
      stats: {
        totalRevenue: paidDocs.reduce((sum, d) => sum + d.amount, 0),
        pendingAmount: pendingDocs.reduce((sum, d) => sum + d.amount, 0),
        overdueAmount: overdueDocs.reduce((sum, d) => sum + d.amount, 0),
        totalDocs: ALL_DEMO_DOCS.length
      },
      pagination: { total: docs.length, page: 1, limit: 50, pages: 1 }
    };
  }, [status, search, startDate, endDate]);

  const isDemoUser = user?._id === DEMO_USER_ID;

  if (isDemoUser) {
    return {
      data: demoResponse,
      isLoading: false,
      error: null,
      refetch: query.refetch,
      isDemo: true
    };
  }

  return { ...query, isDemo: false };
};
