import { httpService } from './http-service';

// --- Types ---

export interface TopClient {
  id: string;
  name: string;
  totalSpent: number;
  bookingsCount: number;
  lastVisit: string;
  avatarUrl?: string;
}

export interface StudioOccupancy {
  studioId: string;
  name: string;
  occupancy: number;
}

export interface MerchantStats {
  totalRevenue: number;
  totalBookings: number;
  avgPerBooking: number;
  newClients: number;
  trends: {
    totalRevenue: string;
    totalBookings: string;
    avgPerBooking: string;
    newClients: string;
  };
  isPositive: {
    totalRevenue: boolean;
    totalBookings: boolean;
    avgPerBooking: boolean;
    newClients: boolean;
  };
  quickStats: {
    avgSessionTime: number;
    occupancy: number;
    studios: StudioOccupancy[];
  };
  topClients: TopClient[];
  revenueByPeriod: {
    monthly: number[];
    weekly: number[];
    daily: number[];
  };
}

export type DocStatus = 'paid' | 'pending' | 'overdue' | 'draft';
export type DocType = 'invoice' | 'credit_note' | 'receipt' | 'contract';

export interface MerchantDocument {
  id: string;
  externalId: string;
  number: string;
  type: DocType;
  studioId?: string;
  studioName: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  status: DocStatus;
  customerName: string;
  customerEmail?: string;
  documentUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface DocumentsStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  totalDocs: number;
}

export interface MerchantDocumentsResponse {
  documents: MerchantDocument[];
  stats: DocumentsStats;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface GetDocumentsParams {
  userId: string;
  page?: number;
  limit?: number;
  status?: DocStatus | 'all';
  studioId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetStatsParams {
  userId: string;
  startDate?: string;
  endDate?: string;
}

// --- API Functions ---

/**
 * Get merchant statistics for dashboard
 */
export const getMerchantStats = async (params: GetStatsParams): Promise<MerchantStats> => {
  return httpService.get<MerchantStats>('/merchant/stats', params);
};

/**
 * Get merchant documents (invoices, receipts, etc.)
 */
export const getMerchantDocuments = async (params: GetDocumentsParams): Promise<MerchantDocumentsResponse> => {
  return httpService.get<MerchantDocumentsResponse>('/merchant/documents', params);
};

/**
 * Get a single document by ID
 */
export const getMerchantDocument = async (id: string): Promise<MerchantDocument> => {
  return httpService.get<MerchantDocument>(`/merchant/documents/${id}`);
};
