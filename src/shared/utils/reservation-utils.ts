import dayjs from 'dayjs';
import { Reservation } from 'src/types/index';

/**
 * Filter reservations to get only active ones (confirmed/pending that haven't ended more than buffer hours ago)
 * @param reservations - Array of reservations to filter
 * @param bufferHours - Number of hours buffer after booking end time (default: 3)
 * @returns Filtered array of active reservations
 */
export const getActiveReservations = (
  reservations: Reservation[],
  bufferHours: number = 3
): Reservation[] => {
  const now = dayjs();
  const cutoffTime = now.subtract(bufferHours, 'hour');

  return reservations.filter((reservation) => {
    // Only count confirmed or pending reservations
    if (reservation.status !== 'confirmed' && reservation.status !== 'pending') {
      return false;
    }

    // Check if booking end time hasn't passed by more than buffer hours
    if (!reservation.bookingDate || !reservation.timeSlots || reservation.timeSlots.length === 0) {
      return false;
    }

    const startTime = reservation.timeSlots[0];
    const bookingStartDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');

    if (!bookingStartDateTime.isValid()) {
      return false;
    }

    // Calculate booking end time: start time + duration (each timeSlot is 1 hour)
    const bookingDurationHours = reservation.timeSlots.length;
    const bookingEndDateTime = bookingStartDateTime.add(bookingDurationHours, 'hour');

    // Return true if booking END time is after (now - buffer hours), meaning it hasn't ended more than buffer hours ago
    return bookingEndDateTime.isAfter(cutoffTime);
  });
};

/**
 * Get count of active reservations
 * @param reservations - Array of reservations to count
 * @param bufferHours - Number of hours buffer after booking end time (default: 3)
 * @returns Count of active reservations
 */
export const getActiveReservationsCount = (
  reservations: Reservation[],
  bufferHours: number = 3
): number => {
  return getActiveReservations(reservations, bufferHours).length;
};

