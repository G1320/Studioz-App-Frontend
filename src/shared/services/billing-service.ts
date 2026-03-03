import { httpService } from './http-service';

// ─── Types ──────────────────────────────────────────────────────

export interface BillingCycle {
  _id: string;
  vendorId: string;
  period: string;
  totalTransactionAmount: number;
  totalFeeAmount: number;
  feeCount: number;
  feePercentage: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  sumitPaymentId?: string;
  chargedAt?: string;
  failureReason?: string;
  retryCount: number;
  invoiceDocumentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformFee {
  _id: string;
  vendorId: string;
  reservationId?: string;
  studioId?: string;
  transactionType: 'reservation' | 'quick_charge' | 'multivendor';
  transactionAmount: number;
  feePercentage: number;
  feeAmount: number;
  status: 'pending' | 'billed' | 'paid' | 'credited' | 'waived';
  sumitPaymentId?: string;
  period: string;
  createdAt: string;
}

export interface CurrentFeesResponse {
  period: string;
  feePercentage: number;
  fees: PlatformFee[];
  totalFeeAmount: number;
  totalTransactionAmount: number;
  count: number;
}

// ─── API Functions ──────────────────────────────────────────────

export const getBillingHistory = async (userId: string): Promise<BillingCycle[]> => {
  const res = await httpService.get<{ data: BillingCycle[] }>('/merchant/billing/history', { userId });
  return (res as any).data || res;
};

export const getCurrentFees = async (userId: string): Promise<CurrentFeesResponse> => {
  const res = await httpService.get<{ data: CurrentFeesResponse }>('/merchant/billing/current', { userId });
  return (res as any).data || res;
};

export const getBillingCycleFees = async (cycleId: string): Promise<PlatformFee[]> => {
  const res = await httpService.get<{ data: PlatformFee[] }>(`/merchant/billing/cycle/${cycleId}/fees`);
  return (res as any).data || res;
};
