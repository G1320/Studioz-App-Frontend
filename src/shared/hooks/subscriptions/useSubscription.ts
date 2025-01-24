import { useState, useEffect } from 'react';
import { useUserContext } from '@core/contexts';
import { getSubscriptionDetails } from '@services/subscription-service';
import type { Subscription } from 'src/types/subscription';

interface SubscriptionState {
  isLoading: boolean;
  hasSubscription: boolean;
  isPro: boolean;
  isStarter: boolean;
  subscription: Subscription | null;
}

export const useSubscription = () => {
  const { user } = useUserContext();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionState>({
    isLoading: true,
    hasSubscription: false,
    isPro: false,
    isStarter: false,
    subscription: null
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user?._id || !user.subscriptionId || user.subscriptionStatus !== 'ACTIVE') {
        setSubscriptionData((prev) => ({
          ...prev,
          isLoading: false,
          hasSubscription: false,
          isPro: false,
          isStarter: false,
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
          subscription
        });
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        setSubscriptionData({
          isLoading: false,
          hasSubscription: false,
          isPro: false,
          isStarter: false,
          subscription: null
        });
      }
    };

    checkSubscription();
  }, [user?._id, user?.subscriptionId, user?.subscriptionStatus]);

  return subscriptionData;
};
