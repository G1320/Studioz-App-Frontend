// src/hooks/useSubscription.ts
import { useState, useEffect } from 'react';
import { useUserContext } from '@contexts/UserContext';
import { getSubscriptionDetails } from '@services/subscription-service';
import type { Subscription, PayPalSubscriptionResponse, SubscriptionDetailsResponse } from 'src/types/subscription';

interface SubscriptionState {
  isLoading: boolean;
  hasSubscription: boolean;
  isPro: boolean;
  isStarter: boolean;
  subscription: Subscription | null;
  paypalDetails: PayPalSubscriptionResponse | null;
}

export const useSubscription = () => {
  const { user } = useUserContext();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionState>({
    isLoading: true,
    hasSubscription: false,
    isPro: false,
    isStarter: false,
    subscription: null,
    paypalDetails: null
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
          subscription: null,
          paypalDetails: null
        }));
        return;
      }

      try {
        const response = await getSubscriptionDetails(user.subscriptionId);
        const data = response as SubscriptionDetailsResponse;

        setSubscriptionData((prev) => ({
          ...prev,
          isLoading: false,
          hasSubscription: true,
          isPro: data.subscription.planId === 'pro',
          isStarter: data.subscription.planId === 'starter',
          subscription: data.subscription,
          paypalDetails: data.paypalDetails
        }));
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        setSubscriptionData((prev) => ({
          ...prev,
          isLoading: false,
          hasSubscription: false,
          isPro: false,
          isStarter: false,
          subscription: null,
          paypalDetails: null
        }));
      }
    };

    checkSubscription();
  }, [user?._id, user?.subscriptionId, user?.subscriptionStatus]);

  return subscriptionData;
};
