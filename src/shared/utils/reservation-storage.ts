/**
 * Utility functions for managing reservation data in localStorage
 */

export interface StoredReservation {
  reservationId: string;
  itemId: string;
  timestamp: number;
}

/**
 * Get all reservation IDs stored in localStorage
 */
export const getStoredReservationIds = (): string[] => {
  const reservationIds: string[] = [];
  
  // Scan localStorage for all reservation_* keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('reservation_')) {
      const reservationId = localStorage.getItem(key);
      if (reservationId) {
        reservationIds.push(reservationId);
      }
    }
  }
  
  return reservationIds;
};

/**
 * Get stored customer phone number
 */
export const getStoredCustomerPhone = (): string | null => {
  return localStorage.getItem('customerPhone');
};

/**
 * Store a reservation ID
 */
export const storeReservationId = (itemId: string, reservationId: string): void => {
  localStorage.setItem(`reservation_${itemId}`, reservationId);
};

/**
 * Remove a stored reservation ID
 */
export const removeStoredReservationId = (itemId: string): void => {
  localStorage.removeItem(`reservation_${itemId}`);
};

/**
 * Check if user has any stored reservations
 */
export const hasStoredReservations = (): boolean => {
  return getStoredReservationIds().length > 0;
};

