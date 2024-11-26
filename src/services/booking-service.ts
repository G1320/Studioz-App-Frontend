import { httpService } from './http-service';
import { CartItem, Item } from 'src/types/index';

const bookingEndpoint = '/bookings';

export const reserveNextTimeSlot = async (item: CartItem) => {
  try {
    return await httpService.post<Item>(`${bookingEndpoint}/reserve-time-slot/`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};

export const reserveTimeSlots = async (item: CartItem) => {
  try {
    return await httpService.post<Item>(`${bookingEndpoint}/reserve-time-slots/`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};

export const releaseLastTimeSlot = async (item: CartItem) => {
  try {
    return await httpService.delete<Item>(`${bookingEndpoint}/release-time-slot/`, item);
  } catch (error) {
    console.error('Error removing booking:', error);
    throw error;
  }
};
