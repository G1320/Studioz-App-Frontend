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
