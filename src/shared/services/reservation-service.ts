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
