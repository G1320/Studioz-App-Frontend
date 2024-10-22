import { httpService } from './http-service';
import { CartItem } from '@/types/index';

const bookingEndpoint = '/bookings';

export const bookItem = async (item: CartItem, userId: string) => {
  console.log('item: ', item);
  try {
    return await httpService.post(`${bookingEndpoint}/book-item/${userId}`, item);
  } catch (error) {
    console.error('Error booking item:', error);
    throw error;
  }
};

// // Helper to generate consecutive time slots (e.g., ['10:00', '11:00'])
// const getConsecutiveTimeSlots = (start: string, hours: number): string[] => {
//   const [startHour] = start.split(':').map(Number);
//   return Array.from({ length: hours }, (_, i) => `${String(startHour + i).padStart(2, '0')}:00`);
// };

// // Function to book an item
// export const bookItem = (item: Item, bookingDate: string, startTime: string, quantity: number): boolean => {
//   const availability = item.availability?.find((a) => a.date === bookingDate);

//   if (!availability) {
//     console.error('No availability for the selected date.');
//     return false;
//   }

//   const requestedSlots = getConsecutiveTimeSlots(startTime, quantity);

//   // Check if all requested slots are available
//   const allAvailable = requestedSlots.every((slot) => availability.times.includes(slot));

//   if (!allAvailable) {
//     console.error('One or more time slots are unavailable.');
//     return false;
//   }

//   // Remove the booked time slots
//   availability.times = availability.times.filter((time) => !requestedSlots.includes(time));

//   console.log(`Booked ${item.name} from ${startTime} for ${quantity} hours.`);
//   return true;
// };
