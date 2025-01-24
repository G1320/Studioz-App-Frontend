import { httpService } from '@shared/services/index';

const emailEndpoint = '/emails';

interface EmailResponse {
  message: string;
}

interface SubscriptionEmailData {
  customerName: string;
  planName: string;
  planPrice: number;
  subscriptionId: string;
  startDate: Date;
}

export const sendSubscriptionConfirmation = async (
  email: string,
  subscriptionData: SubscriptionEmailData
): Promise<EmailResponse> => {
  try {
    const payload = {
      email,
      subscriptionData
    };

    return await httpService.post<EmailResponse>(`${emailEndpoint}/send-subscription-confirmation`, payload);
  } catch (error) {
    console.error('Failed to send subscription confirmation:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<EmailResponse> => {
  try {
    const payload = {
      email,
      name
    };
    const response = await httpService.post<EmailResponse>(`${emailEndpoint}/send-welcome`, payload);
    return response;
  } catch (error) {
    console.error('Failed to send welcome email', error);
    throw error;
  }
};

export const sendOrderConfirmation = async (email: string, orderData: any): Promise<EmailResponse> => {
  try {
    const payload = {
      email,
      orderData
    };

    const response = await httpService.post<EmailResponse>(`${emailEndpoint}/send-order-confirmation`, payload);

    return response;
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    throw error;
  }
};

export const sendPayoutNotification = async (
  sellerId: string,
  amount: number,
  orderId: string
): Promise<EmailResponse> => {
  try {
    const payload = {
      sellerId,
      amount,
      orderId
    };

    const response = await httpService.post<EmailResponse>(`${emailEndpoint}/send-payout-notification`, payload);

    return response;
  } catch (error) {
    console.error('Failed to send payout notification:', error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string, resetToken: string): Promise<EmailResponse> => {
  try {
    const payload = {
      email,
      resetToken
    };
    const response = await httpService.post<EmailResponse>(`${emailEndpoint}/send-password-reset`, payload);
    return response;
  } catch (error: unknown) {
    console.error('Failed to send password reset email', error);
    throw error;
  }
};

export type { EmailResponse };
