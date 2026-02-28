import { httpService } from '@shared/services';

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

/**
 * Send a test email using a specific template type
 */
export interface SendTestEmailResponse {
  message: string;
  templateType: string;
}

export const sendTestEmail = async (
  email: string,
  templateType: string,
  mode: 'dark' | 'light' = 'dark'
): Promise<SendTestEmailResponse> => {
  try {
    const response = await httpService.post<SendTestEmailResponse>(`${emailEndpoint}/send-test`, {
      email,
      templateType,
      mode
    });
    return response;
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
};

/**
 * Get the preview URL for an email template (used when embedding would be blocked by X-Frame-Options).
 * Prefer getEmailPreviewHtml and iframe srcdoc to avoid "refused to connect" in production.
 */
export const getEmailPreviewUrl = (templateType: string, mode: 'dark' | 'light' = 'dark'): string => {
  const baseUrl =
    import.meta.env.VITE_NODE_ENV === 'production' ? 'https://api.studioz.co.il/api' : 'http://localhost:3003/api';
  return `${baseUrl}/emails/preview/${templateType}?mode=${mode}`;
};

/**
 * Fetch email preview HTML from the API. Use with iframe srcdoc to avoid X-Frame-Options blocking.
 */
export const getEmailPreviewHtml = async (
  templateType: string,
  mode: 'dark' | 'light' = 'dark'
): Promise<string> => {
  return httpService.getText(`/emails/preview/${templateType}`, { mode });
};

export type { EmailResponse };
