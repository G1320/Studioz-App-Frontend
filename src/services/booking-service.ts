import { httpService } from './http-service';
import { CartItem } from '@models/index';

const bookingEndpoint = '/bookings';

export const bookItem = async (item: CartItem, userId: string) => {
  // console.log('userId: ', userId);
  // console.log('item: ', item);
  try {
    return await httpService.post(`${bookingEndpoint}/${userId}/book-item`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};
