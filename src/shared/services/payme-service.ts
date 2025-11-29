import { httpService } from './http-service';

const PAYME_ENDPOINT = '/payme';

export interface PayMeCustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface PayMeCartItem {
  name: string;
  price: number;
  quantity: number;
  itemId: string;
  studioId: string;
}

export interface GeneratePaymentParams {
  amount: number;
  currency?: string;
  description: string;
  customer: PayMeCustomerInfo;
  items: PayMeCartItem[];
  vendorId?: string;
  successUrl?: string;
  cancelUrl?: string;
  ipnUrl?: string;
}

export interface PayMePaymentResponse {
  success: boolean;
  data?: {
    payment_id: string;
    payment_url?: string;
    identifier?: string;
    public_key?: string;
  };
  error?: string;
}

export interface PayMePaymentStatus {
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount?: number;
  currency?: string;
}

export const paymeService = {
  /**
   * Generate a payment through PayMe API
   * This creates a payment request and returns payment details
   */
  generatePayment: async (params: GeneratePaymentParams): Promise<PayMePaymentResponse> => {
    try {
      const response = await httpService.post<PayMePaymentResponse>(`${PAYME_ENDPOINT}/generate-payment`, {
        amount: params.amount,
        currency: params.currency || 'ILS',
        description: params.description,
        customer: params.customer,
        items: params.items,
        vendorId: params.vendorId,
        successUrl: params.successUrl || `${window.location.origin}/payment-success`,
        cancelUrl: params.cancelUrl || `${window.location.origin}/payment-cancelled`,
        ipnUrl: params.ipnUrl || `${window.location.origin}/api/payme/ipn`
      });
      return response;
    } catch (error) {
      console.error('Error generating PayMe payment:', error);
      throw error;
    }
  },

  /**
   * Process marketplace payment with split transactions
   * This handles split payments between platform and vendors
   */
  processMarketplacePayment: async (
    paymentId: string,
    vendorId: string,
    items: PayMeCartItem[]
  ): Promise<PayMePaymentResponse> => {
    try {
      const response = await httpService.post<PayMePaymentResponse>(`${PAYME_ENDPOINT}/marketplace/process`, {
        paymentId,
        vendorId,
        items
      });
      return response;
    } catch (error) {
      console.error('Error processing PayMe marketplace payment:', error);
      throw error;
    }
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentId: string): Promise<PayMePaymentStatus> => {
    try {
      const response = await httpService.get<PayMePaymentStatus>(`${PAYME_ENDPOINT}/payment-status/${paymentId}`);
      return response;
    } catch (error) {
      console.error('Error getting PayMe payment status:', error);
      throw error;
    }
  },

  /**
   * Confirm payment after successful processing
   * This should be called after IPN/webhook confirms payment
   */
  confirmPayment: async (paymentId: string, orderId?: string): Promise<PayMePaymentResponse> => {
    try {
      const response = await httpService.post<PayMePaymentResponse>(`${PAYME_ENDPOINT}/confirm-payment`, {
        paymentId,
        orderId
      });
      return response;
    } catch (error) {
      console.error('Error confirming PayMe payment:', error);
      throw error;
    }
  }
};

