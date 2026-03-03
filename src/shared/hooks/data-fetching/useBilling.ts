import { useQuery } from '@tanstack/react-query';
import { getBillingHistory, getCurrentFees, getBillingCycleFees } from '@shared/services';
import { useUserContext } from '@core/contexts';

export const useBillingHistory = () => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';

  return useQuery({
    queryKey: ['billingHistory', userId],
    queryFn: () => getBillingHistory(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });
};

export const useCurrentFees = () => {
  const { user } = useUserContext();
  const userId = user?._id ?? '';

  return useQuery({
    queryKey: ['billingCurrentFees', userId],
    queryFn: () => getCurrentFees(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    retry: 1
  });
};

export const useBillingCycleFees = (cycleId: string | null) => {
  return useQuery({
    queryKey: ['billingCycleFees', cycleId],
    queryFn: () => getBillingCycleFees(cycleId!),
    enabled: !!cycleId,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });
};
