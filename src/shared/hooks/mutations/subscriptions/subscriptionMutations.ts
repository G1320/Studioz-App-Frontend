import { useMutationHandler } from '@shared/hooks';
import { sumitService } from '@shared/services';
import { Subscription } from 'src/types/subscription';
import { useTranslation } from 'react-i18next';

export const useCancelSubscriptionMutation = (subscriptionId: string) => {
  const { t } = useTranslation('common');

  return useMutationHandler<Subscription, void>({
    mutationFn: async () => {
      const result = await sumitService.cancelSubscription(subscriptionId);
      return result as Subscription;
    },
    successMessage: t('toasts.success.subscriptionCancelled'),
    invalidateQueries: [{ queryKey: 'subscription', targetId: subscriptionId }]
  });
};
