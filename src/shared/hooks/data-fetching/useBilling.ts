import { useQuery } from '@tanstack/react-query';
import { getBillingHistory, getCurrentFees, getBillingCycleFees } from '@shared/services';
import type { PlatformFee } from '@shared/services/billing-service';
import { useUserContext } from '@core/contexts';
import { DEMO_BILLING_HISTORY, DEMO_CURRENT_FEES, DEMO_USER_ID } from '@core/config/demo';

export const useBillingHistory = () => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = userId === DEMO_USER_ID;

  const query = useQuery({
    queryKey: ['billingHistory', userId],
    queryFn: () => getBillingHistory(userId),
    enabled: !!userId && !isDemoUser,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  if (isDemoUser) {
    return { ...query, data: DEMO_BILLING_HISTORY, isLoading: false, isDemo: true };
  }
  return { ...query, isDemo: false };
};

export const useCurrentFees = () => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';
  const isDemoUser = userId === DEMO_USER_ID;

  const query = useQuery({
    queryKey: ['billingCurrentFees', userId],
    queryFn: () => getCurrentFees(userId),
    enabled: !!userId && !isDemoUser,
    staleTime: 1000 * 60 * 2,
    retry: 1
  });

  if (isDemoUser) {
    return { ...query, data: DEMO_CURRENT_FEES, isLoading: false, isDemo: true };
  }
  return { ...query, isDemo: false };
};

export const useBillingCycleFees = (cycleId: string | null) => {
  const { user } = useUserContext();
  const isDemoUser = user?._id === DEMO_USER_ID;

  const query = useQuery({
    queryKey: ['billingCycleFees', cycleId],
    queryFn: () => getBillingCycleFees(cycleId!),
    enabled: !!cycleId && !isDemoUser,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  if (isDemoUser) {
    const demoCycle = DEMO_BILLING_HISTORY.find((c) => c._id === cycleId);
    const demoFees: PlatformFee[] = demoCycle
      ? Array.from({ length: demoCycle.feeCount }, (_, i) => ({
          _id: `demo-fee-${cycleId}-${i}`,
          vendorId: 'demo-vendor',
          reservationId: `demo-res-${i}`,
          studioId: 'demo-studio',
          transactionType: 'reservation' as const,
          transactionAmount: Math.round(demoCycle.totalTransactionAmount / demoCycle.feeCount),
          feePercentage: demoCycle.feePercentage,
          feeAmount: Math.round((demoCycle.totalFeeAmount / demoCycle.feeCount) * 100) / 100,
          status: 'paid' as const,
          period: demoCycle.period,
          createdAt: demoCycle.createdAt
        }))
      : [];

    return { ...query, data: demoFees, isLoading: false, isDemo: true };
  }
  return { ...query, isDemo: false };
};
