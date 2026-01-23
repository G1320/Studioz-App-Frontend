import { useState, useEffect } from 'react';
import { useUserContext } from '@core/contexts';
import { getSubscriptionDetails } from '@shared/services/subscription-service';
import type { Subscription } from 'src/types/subscription';

// Valid subscription statuses that count as "has subscription"
const ACTIVE_STATUSES = ['ACTIVE', 'TRIAL'];

interface SubscriptionState {
  isLoading: boolean;
  hasSubscription: boolean;
  isPro: boolean;
  isStarter: boolean;
  isTrial: boolean;
  subscription: Subscription | null;
}

export const useSubscription = () => {
  const { user } = useUserContext();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionState>({
    isLoading: true,
    hasSubscription: false,
    isPro: false,
    isStarter: false,
    isTrial: false,
    subscription: null
  });

  useEffect(() => {
    const checkSubscription = async () => {
      const hasValidStatus = user?.subscriptionStatus && ACTIVE_STATUSES.includes(user.subscriptionStatus);
      
      if (!user?._id || !user.subscriptionId || !hasValidStatus) {
        setSubscriptionData((prev) => ({
          ...prev,
          isLoading: false,
          hasSubscription: false,
          isPro: false,
          isStarter: false,
          isTrial: false,
          subscription: null
        }));
        return;
      }

      try {
        const subscription = (await getSubscriptionDetails(user.subscriptionId)) as Subscription;

        setSubscriptionData({
          isLoading: false,
          hasSubscription: true,
          isPro: subscription.planId === 'pro',
          isStarter: subscription.planId === 'starter',
          isTrial: user.subscriptionStatus === 'TRIAL',
          subscription
        });
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        setSubscriptionData({
          isLoading: false,
          hasSubscription: false,
          isPro: false,
          isStarter: false,
          isTrial: false,
          subscription: null
        });
      }
    };

    checkSubscription();
  }, [user?._id, user?.subscriptionId, user?.subscriptionStatus]);

  return subscriptionData;
};
