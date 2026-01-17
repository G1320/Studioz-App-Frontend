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

// Brevo Email Templates API

export interface BrevoTemplate {
  id: number;
  name: string;
  subject: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  htmlContent?: string;
  sender?: {
    name?: string;
    email?: string;
  };
  replyTo?: string;
  toField?: string;
  tag?: string;
}

export interface BrevoTemplatesResponse {
  templates: BrevoTemplate[];
  count: number;
}

/**
 * Fetch all email templates from Brevo
 */
export const getEmailTemplates = async (): Promise<BrevoTemplatesResponse> => {
  try {
    const response = await httpService.get<BrevoTemplatesResponse>(`${emailEndpoint}/templates`);
    return response;
  } catch (error) {
    console.error('Failed to fetch email templates:', error);
    throw error;
  }
};

/**
 * Fetch a single email template by ID from Brevo
 */
export const getEmailTemplate = async (id: number): Promise<BrevoTemplate> => {
  try {
    const response = await httpService.get<BrevoTemplate>(`${emailEndpoint}/templates/${id}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch email template:', error);
    throw error;
  }
};

/**
 * Send a test email using a specific template type
 */
export interface SendTestEmailResponse {
  message: string;
  templateType: string;
  templateId: number;
}

export const sendTestEmail = async (
  email: string,
  templateType: string
): Promise<SendTestEmailResponse> => {
  try {
    const response = await httpService.post<SendTestEmailResponse>(`${emailEndpoint}/send-test`, {
      email,
      templateType
    });
    return response;
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
};

export type { EmailResponse };
