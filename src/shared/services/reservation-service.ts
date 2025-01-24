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
  console.log('studioId: ', studioId);
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

export const deleteReservationById = async (reservationId: string): Promise<Reservation> => {
  try {
    return await httpService.delete(`${reservationEndpoint}/${reservationId}`);
  } catch (error) {
    console.error(`Error deleting reservation with ID ${reservationId}:`, error);
    throw error;
  }
};
