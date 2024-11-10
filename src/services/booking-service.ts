import { httpService } from './http-service';
import { CartItem, Item } from '@models/index';

const bookingEndpoint = '/bookings';

export const reserveNextTimeSlot = async (item: CartItem, userId?: string) => {
  try {
    return await httpService.post<Item>(`${bookingEndpoint}/reserve-time-slot/${userId}`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};

export const reserveTimeSlots = async (item: CartItem, userId?: string) => {
  try {
    return await httpService.post<Item>(`${bookingEndpoint}/reserve-time-slots/${userId}`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};

export const releaseLastTimeSlot = async (item: CartItem) => {
  console.log('item: ', item);
  try {
    return await httpService.delete<Item>(`${bookingEndpoint}/release-time-slot/`, item);
  } catch (error) {
    console.error('Error removing booking:', error);
    throw error;
  }
};
