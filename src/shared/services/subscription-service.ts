import { httpService } from '@shared/services';

interface SubscriptionCreateParams {
  userId: string;
  planId: string;
}

interface SubscriptionActivateParams {
  subscriptionId: string;
  sumitPaymentResponse: any;
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

// ============================================
// Trial Subscription Functions
// ============================================

/**
 * Get trial status for a user
 * Returns trial info including days remaining
 */
export const getTrialStatus = async (userId: string): Promise<{
  hasTrial: boolean;
  subscription?: {
    _id: string;
    planId: string;
    planName: string;
    status: string;
    trialEndDate: string;
    daysRemaining: number;
    hasCard: boolean;
  };
  message?: string;
}> => {
  try {
    return await httpService.get(`${subscriptionEndpoint}/trial-status/${userId}`);
  } catch (error) {
    console.error('Error fetching trial status:', error);
    throw error;
  }
};

/**
 * Cancel a trial subscription
 */
export const cancelTrialSubscription = async (subscriptionId: string) => {
  try {
    return await httpService.post(`${subscriptionEndpoint}/cancel-trial/${subscriptionId}`);
  } catch (error) {
    console.error('Error canceling trial subscription:', error);
    throw error;
  }
};
