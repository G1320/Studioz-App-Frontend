import { httpService } from './http-service';

const orderEndpoint = '/payouts';

export const processSellerPayout = async (sellerId: string, amount: number, orderId: string) => {
  try {
    return await httpService.post(`${orderEndpoint}/seller-payouts`, { sellerId, amount, orderId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
