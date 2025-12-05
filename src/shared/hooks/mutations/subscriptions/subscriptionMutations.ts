import { useMutationHandler } from '@shared/hooks';
import { sumitService } from '@shared/services';
import { Subscription } from 'src/types/subscription';

export const useCancelSubscriptionMutation = (subscriptionId: string) => {
  return useMutationHandler<Subscription, void>({
    mutationFn: async () => {
      const result = await sumitService.cancelSubscription(subscriptionId);
      return result as Subscription;
    },
    successMessage: 'Subscription cancelled successfully',
    invalidateQueries: [{ queryKey: 'subscription', targetId: subscriptionId }]
  });
};
