import { httpService } from './http-service';

const orderEndpoint = '/PPorders';

export const processMarketplaceOrder = async (email: string, orderData: string, sellerId: string) => {
  try {
    return await httpService.post(`${orderEndpoint}/marketplace/process-order`, { email, orderData, sellerId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
