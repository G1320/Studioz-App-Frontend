import { httpService } from '@shared/services';
import { Reservation } from 'src/types/index';

const reservationEndpoint = '/reservations';

export const createReservation = async (reservation: Reservation): Promise<Reservation> => {
  try {
    return await httpService.post(reservationEndpoint, reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const getReservations = async (params = {}): Promise<Reservation[]> => {
  try {
    return await httpService.get(reservationEndpoint, { params });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const getReservationsByStudioId = async (studioId: string): Promise<Reservation[]> => {
  try {
    return await httpService.get(`${reservationEndpoint}/studio/${studioId}`);
  } catch (error) {
    console.error(`Error fetching reservations for studio with ID ${studioId}:`, error);
    throw error;
  }
};

export const getReservationById = async (reservationId: string): Promise<Reservation> => {
  try {
    return await httpService.get(`${reservationEndpoint}/${reservationId}`);
  } catch (error) {
    console.error(`Error fetching reservation with ID ${reservationId}:`, error);
    throw error;
  }
};

export const updateReservationById = async (
  reservationId: string,
  updatedReservation: Partial<Reservation>
): Promise<Reservation> => {
  try {
    return await httpService.put(`${reservationEndpoint}/${reservationId}`, updatedReservation);
  } catch (error) {
    console.error(`Error updating reservation with ID ${reservationId}:`, error);
    throw error;
  }
};

export const cancelReservationById = async (reservationId: string): Promise<Reservation> => {
  try {
    // Cancel instead of deleting to keep record/history
    return await httpService.patch(`${reservationEndpoint}/${reservationId}/cancel`);
  } catch (error) {
    console.error(`Error cancelling reservation with ID ${reservationId}:`, error);
    throw error;
  }
};

export const approveReservationById = async (reservationId: string): Promise<Reservation> => {
  try {
    // Approve reservation (vendor action) - will charge saved card if present
    return await httpService.patch(`${reservationEndpoint}/${reservationId}/approve`);
  } catch (error) {
    console.error(`Error approving reservation with ID ${reservationId}:`, error);
    throw error;
  }
};

export const getReservationsByPhone = async (phone: string): Promise<Reservation[]> => {
  try {
    return await httpService.get(`${reservationEndpoint}/phone/${phone}`);
  } catch (error) {
    console.error(`Error fetching reservations for phone ${phone}:`, error);
    throw error;
  }
};

// ============================================================
// RESCHEDULE FUNCTIONS
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

/**
 * Get available time slots for rescheduling a reservation
 * @param reservationId - The reservation ID to reschedule
 * @param daysAhead - Number of days to look ahead (default: 14, max: 60)
 */
export const getAvailableSlotsForReschedule = async (
  reservationId: string,
  daysAhead: number = 14
): Promise<AvailableSlotsResponse> => {
  try {
    return await httpService.get(`${reservationEndpoint}/${reservationId}/reschedule/available`, { days: daysAhead });
  } catch (error) {
    console.error(`Error fetching available slots for reservation ${reservationId}:`, error);
    throw error;
  }
};

/**
 * Check if a specific date/time combination is available for rescheduling
 */
export const checkRescheduleAvailability = async (
  reservationId: string,
  date: string,
  timeSlots: string[]
): Promise<CheckAvailabilityResponse> => {
  try {
    return await httpService.post(`${reservationEndpoint}/${reservationId}/reschedule/check`, { date, timeSlots });
  } catch (error) {
    console.error(`Error checking reschedule availability for reservation ${reservationId}:`, error);
    throw error;
  }
};

/**
 * Reschedule a reservation to a new date/time
 */
export const rescheduleReservation = async (
  reservationId: string,
  date: string,
  timeSlots: string[]
): Promise<Reservation> => {
  try {
    return await httpService.post(`${reservationEndpoint}/${reservationId}/reschedule`, { date, timeSlots });
  } catch (error) {
    console.error(`Error rescheduling reservation ${reservationId}:`, error);
    throw error;
  }
};
