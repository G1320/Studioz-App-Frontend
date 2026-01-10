import { httpService } from './http-service';

const SUMIT_ENDPOINT = '/sumit';

interface CustomerInfo {
  customerName: string;
  customerEmail: string;
}

interface PlanDetails {
  name: string;
  amount: number;
  description: string;
  durationMonths?: number;
  recurrence?: number;
}

interface SumitResponse {
  success: boolean;
  data?: {
    Payment: {
      ValidPayment: boolean;
      ID: string;
      CustomerID: string;
      StatusDescription?: string;
    };
  };
  error?: string;
}

interface CartItem {
  merchantId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface MultiVendorParams {
  vendorId: string;
  items: CartItem[];
  singleUseToken: string;
  customerInfo: CustomerInfo;
}

// Types for reservation payment (save card for later)
interface SaveCardParams {
  singleUseToken: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  vendorId: string;
}

interface SaveCardResponse {
  success: boolean;
  data?: {
    customerId: string;
    creditCardToken: string;
    lastFourDigits: string;
  };
  error?: string;
}

interface ChargeSavedCardParams {
  sumitCustomerId: string;
  amount: number;
  description: string;
  vendorId: string;
}

interface ChargeSavedCardResponse {
  success: boolean;
  data?: {
    Payment: {
      ID: string;
      ValidPayment: boolean;
      StatusDescription?: string;
    };
  };
  error?: string;
}

interface RefundParams {
  sumitPaymentId: string;
  amount: number;
  vendorId: string;
}

interface RefundResponse {
  success: boolean;
  data?: {
    refundId: string;
  };
  error?: string;
}

export const sumitService = {
  processCreditCardPayment: async (singleUseToken: string, amount: number, description: string, customerInfo: any) => {
    try {
      return await httpService.post(`${SUMIT_ENDPOINT}/process-payment`, {
        singleUseToken,
        amount,
        description,
        customerInfo
      });
    } catch (error) {
      console.error('Error processing Sumit payment:', error);
      throw error;
    }
  },

  createSubscriptionPayment: async (
    singleUseToken: string,
    customerInfo: CustomerInfo,
    planDetails: PlanDetails
  ): Promise<SumitResponse> => {
    try {
      const response = await httpService.post<SumitResponse>(`${SUMIT_ENDPOINT}/create-subscription`, {
        singleUseToken,
        customerInfo,
        planDetails
      });
      return response;
    } catch (error) {
      console.error('Error creating Sumit subscription:', error);
      throw error;
    }
  },

  cancelSubscription: async (subscriptionId: string) => {
    try {
      return await httpService.post(`${SUMIT_ENDPOINT}/cancel-subscription/${subscriptionId}`);
    } catch (error) {
      console.error('Error canceling Sumit subscription:', error);
      throw error;
    }
  },

  multivendorCharge: async (params: MultiVendorParams): Promise<SumitResponse> => {
    try {
      const response = await httpService.post<SumitResponse>(`${SUMIT_ENDPOINT}/multivendor-charge`, params);
      return response;
    } catch (error) {
      console.error('Error processing multivendor charge:', error);
      throw error;
    }
  },

  getSumitToken: async (formData: FormData) => {
    try {
      const tokenResponse = await fetch('https://api.sumit.co.il/creditguy/vault/tokenizesingleuse', {
        method: 'POST',
        headers: { accept: 'text/plain' },
        body: formData
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok || tokenData.Status !== 0) {
        // Provide user-friendly error messages
        let errorMessage = tokenData.UserErrorMessage || tokenData.TechnicalErrorDetails;
        
        // Map common Sumit error codes to user-friendly messages
        if (tokenData.Status) {
          const errorMessages: Record<number, string> = {
            1: 'Invalid card number. Please check your card details and try again.',
            2: 'Invalid expiration date. Please check the month and year.',
            3: 'Invalid CVV. Please check the 3-4 digit code on the back of your card.',
            4: 'Invalid ID number. Please check your ID number and try again.',
            5: 'Card expired. Please use a different payment method.',
            6: 'Insufficient funds. Please check your account balance or use a different card.',
            7: 'Card declined. Please contact your bank or use a different payment method.',
            8: 'Payment processing error. Please try again or contact support.',
          };
          
          errorMessage = errorMessages[tokenData.Status] || errorMessage || 'Payment validation failed. Please check your payment details and try again.';
        }
        
        throw new Error(errorMessage || 'Failed to validate payment information. Please check your details and try again.');
      }

      if (!tokenData.Data?.SingleUseToken) {
        throw new Error('Failed to process payment token. Please try again.');
      }

      return tokenData.Data.SingleUseToken;
    } catch (error: any) {
      // Re-throw with user-friendly message if it's already an Error with a message
      if (error instanceof Error) {
        throw error;
      }
      // Handle network errors
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  validateToken: async (singleUseToken: string) => {
    try {
      return await httpService.post(`${SUMIT_ENDPOINT}/validate-token`, {
        singleUseToken
      });
    } catch (error) {
      console.error('Error validating Sumit token:', error);
      throw error;
    }
  },

  /**
   * Save a customer's card for later charging (used for reservation payments)
   * Card is saved under the vendor's Sumit account for marketplace payments
   */
  saveCardForLaterCharge: async (params: SaveCardParams): Promise<SaveCardResponse> => {
    try {
      const response = await httpService.post<SaveCardResponse>(`${SUMIT_ENDPOINT}/save-card`, params);
      return response;
    } catch (error) {
      console.error('Error saving card for later charge:', error);
      throw error;
    }
  },

  /**
   * Charge a previously saved card (used when reservation is approved)
   */
  chargeSavedCard: async (params: ChargeSavedCardParams): Promise<ChargeSavedCardResponse> => {
    try {
      const response = await httpService.post<ChargeSavedCardResponse>(`${SUMIT_ENDPOINT}/charge-saved-card`, params);
      return response;
    } catch (error) {
      console.error('Error charging saved card:', error);
      throw error;
    }
  },

  /**
   * Refund a payment (used when cancelling a charged reservation)
   */
  refundPayment: async (params: RefundParams): Promise<RefundResponse> => {
    try {
      const response = await httpService.post<RefundResponse>(`${SUMIT_ENDPOINT}/refund`, params);
      return response;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
};
