import { httpService } from '@services/index';

const emailEndpoint = '/emails';

interface EmailResponse {
  message: string;
}

interface OrderDetails {
  id: string;
  items: any[];
  total: number;
  customerName: string;
  orderDate: string;
  paymentStatus: string;
}

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

export const sendOrderConfirmation = async (email: string, orderDetails: OrderDetails): Promise<EmailResponse> => {
  try {
    const payload = {
      email,
      orderDetails
    };

    const response = await httpService.post<EmailResponse>(`${emailEndpoint}/send-order-confirmation`, payload);

    return response;
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
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

export type { EmailResponse, OrderDetails };
