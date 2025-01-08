import { httpService } from './http-service';
import { CartItem, Item } from 'src/types/index';

const bookingEndpoint = '/bookings';

interface StudioBlockData {
  studioId: string;
  bookingDate: string;
  startTime: string;
  hours: number;
}

export const reserveStudioTimeSlots = async (blockData: StudioBlockData) => {
  try {
    return await httpService.post(`${bookingEndpoint}/reserve-studio-time-slot/`, blockData);
  } catch (error) {
    console.error('Error blocking studio time slots:', error);
    throw error;
  }
};

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
