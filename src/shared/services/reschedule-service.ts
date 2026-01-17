import { httpService } from './http-service';

// ============================================================
// TYPES
// ============================================================

export interface AvailableSlot {
  date: string;
  timeSlots: string[];
  isFullyAvailable: boolean;
}

export interface AvailableSlotsResponse {
  slots: AvailableSlot[];
  originalSlotCount: number;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflictingSlots?: string[];
}

export interface RescheduleRequest {
  date: string;
  timeSlots: string[];
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get available time slots for rescheduling a reservation
 * @param reservationId - The reservation ID to reschedule
 * @param daysAhead - Number of days to look ahead (default: 14, max: 60)
 */
export const getAvailableSlots = async (
  reservationId: string,
  daysAhead: number = 14
): Promise<AvailableSlotsResponse> => {
  return httpService.get<AvailableSlotsResponse>(
    `/reservations/${reservationId}/reschedule/available`,
    { days: daysAhead }
  );
};

/**
 * Check if a specific date/time combination is available for rescheduling
 * @param reservationId - The reservation ID to reschedule
 * @param date - Target date in DD/MM/YYYY format
 * @param timeSlots - Array of time slots to book
 */
export const checkAvailability = async (
  reservationId: string,
  date: string,
  timeSlots: string[]
): Promise<CheckAvailabilityResponse> => {
  return httpService.post<CheckAvailabilityResponse>(
    `/reservations/${reservationId}/reschedule/check`,
    { date, timeSlots }
  );
};

/**
 * Reschedule a reservation to a new date/time
 * @param reservationId - The reservation ID to reschedule
 * @param date - New date in DD/MM/YYYY format
 * @param timeSlots - Array of new time slots
 */
export const rescheduleReservation = async <T>(
  reservationId: string,
  date: string,
  timeSlots: string[]
): Promise<T> => {
  return httpService.post<T>(
    `/reservations/${reservationId}/reschedule`,
    { date, timeSlots }
  );
};

/**
 * Helper to format a Date object to DD/MM/YYYY string
 */
export const formatDateForReschedule = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Helper to parse DD/MM/YYYY string to Date object
 */
export const parseDateFromReschedule = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Get available slots and filter to only those with enough time slots
 * Useful for showing only dates where the full original booking can fit
 */
export const getFullyAvailableSlots = async (
  reservationId: string,
  daysAhead: number = 14
): Promise<AvailableSlot[]> => {
  const response = await getAvailableSlots(reservationId, daysAhead);
  return response.slots.filter(slot => slot.isFullyAvailable);
};

export const rescheduleService = {
  getAvailableSlots,
  checkAvailability,
  rescheduleReservation,
  formatDateForReschedule,
  parseDateFromReschedule,
  getFullyAvailableSlots
};

export default rescheduleService;
