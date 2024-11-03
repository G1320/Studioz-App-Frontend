import { httpService } from './http-service';
import { CartItem, Item } from '@models/index';

const bookingEndpoint = '/bookings';

export const bookStudioItem = async (item: CartItem, userId?: string) => {
  try {
    return await httpService.post<Item>(`${bookingEndpoint}/book-item/${userId}`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};
