// src/services/subscriptionService.ts
import { httpService } from '@services/index';
import { Subscription } from 'src/types/index';

const subscriptionEndpoint = '/subscriptions';

interface SubscriptionCreateParams {
  planId: string;
  userId: string;
}

interface SubscriptionActivateParams {
  subscriptionId: string;
  userId: string;
}

export const createSubscription = async ({ planId, userId }: SubscriptionCreateParams): Promise<Subscription> => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/create`, { planId, userId });
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const activateSubscription = async ({
  subscriptionId,
  userId
}: SubscriptionActivateParams): Promise<Subscription> => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/activate`, {
      subscriptionId,
      userId
    });
  } catch (error) {
    console.error('Error activating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<Subscription> => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/cancel/${subscriptionId}`);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const getSubscriptionDetails = async (subscriptionId: string): Promise<Subscription> => {
  try {
    return await httpService.get(`${subscriptionEndpoint}/${subscriptionId}`);
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};

export const getActiveSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    return await httpService.get(`${subscriptionEndpoint}/active/${userId}`);
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    throw error;
  }
};

export const getSubscriptionHistory = async (userId: string): Promise<Subscription[]> => {
  try {
    return await httpService.get(`${subscriptionEndpoint}/history/${userId}`);
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    throw error;
  }
};

export const updateSubscriptionPlan = async (subscriptionId: string, planId: string): Promise<Subscription> => {
  try {
    return await httpService.put(`${subscriptionEndpoint}/${subscriptionId}/plan`, { planId });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
};
