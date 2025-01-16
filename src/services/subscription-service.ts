// src/services/subscriptionService.ts
import { httpService } from '@services/index';

interface SubscriptionCreateParams {
  userId: string;
  planId: string;
}

interface SubscriptionActivateParams {
  subscriptionId: string;
  paypalSubscriptionId: string;
  subscriptionDetails: any;
}

const subscriptionEndpoint = '/subscriptions';

export const createSubscription = async (params: SubscriptionCreateParams) => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/create`, params);
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const activateSubscription = async (params: SubscriptionActivateParams) => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/activate`, params);
  } catch (error) {
    console.error('Error activating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/cancel/${subscriptionId}`);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const getSubscriptionDetails = async (subscriptionId: string) => {
  try {
    return await httpService.get(`${subscriptionEndpoint}/${subscriptionId}`);
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};
