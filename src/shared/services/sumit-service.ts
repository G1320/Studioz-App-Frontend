import { httpService } from './http-service';

const SUMIT_ENDPOINT = '/sumit';

interface CustomerInfo {
  costumerName: string;
  costumerEmail: string;
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
  items: CartItem[];
  singleUseToken: string;
  customerInfo: CustomerInfo;
}

export const sumitService = {
  processCreditCardPayment: async (singleUseToken: string, amount: number, description: string, costumerInfo: any) => {
    try {
      return await httpService.post(`${SUMIT_ENDPOINT}/process-payment`, {
        singleUseToken,
        amount,
        description,
        costumerInfo
      });
    } catch (error) {
      console.error('Error processing Sumit payment:', error);
      throw error;
    }
  },

  createSubscriptionPayment: async (
    singleUseToken: string,
    costumerInfo: CustomerInfo,
    planDetails: PlanDetails
  ): Promise<SumitResponse> => {
    try {
      const response = await httpService.post<SumitResponse>(`${SUMIT_ENDPOINT}/create-subscription`, {
        singleUseToken,
        costumerInfo,
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
    const tokenResponse = await fetch('https://api.sumit.co.il/creditguy/vault/tokenizesingleuse', {
      method: 'POST',
      headers: { accept: 'text/plain' },
      body: formData
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.Status !== 0) {
      throw new Error(tokenData.UserErrorMessage || tokenData.TechnicalErrorDetails || 'Failed to get payment token');
    }

    return tokenData.Data?.SingleUseToken;
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
  }
};
