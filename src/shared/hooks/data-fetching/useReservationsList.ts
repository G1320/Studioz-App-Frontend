import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReservations, getReservationsByPhone, getReservationById } from '@shared/services';
import { Reservation } from 'src/types/index';
import { getLocalUser } from '@shared/services';
import { useMemo } from 'react';
import { getStoredReservationIds } from '@shared/utils/reservation-storage';

interface UseReservationsListOptions {
  phone?: string;
  useStoredIds?: boolean; // If true, fetch reservations from localStorage IDs
  filters?: {
    status?: 'pending' | 'confirmed' | 'expired' | 'all';
    type?: 'incoming' | 'outgoing' | 'all';
  };
}

export const useReservationsList = (options: UseReservationsListOptions = {}) => {
  const queryClient = useQueryClient();
  const user = getLocalUser();
  const { phone, useStoredIds = false, filters = {} } = options;

  // Get stored reservation IDs
  const storedIds = useMemo(() => {
    return useStoredIds ? getStoredReservationIds() : [];
  }, [useStoredIds]);

  // Determine access method
  const accessMethod = useMemo(() => {
    if (user?._id) return 'user';
    if (useStoredIds && storedIds.length > 0) return 'stored';
    if (phone) return 'phone';
    return 'none';
  }, [user?._id, phone, useStoredIds, storedIds.length]);

  // Fetch reservations based on access method
  const {
    data: allReservations = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['reservationsList', accessMethod, user?._id, phone, storedIds.join(',')],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (accessMethod === 'stored' && storedIds.length > 0) {
        // Fetch reservations by stored IDs
        const reservations = await Promise.all(
          storedIds.map(
            (id) => getReservationById(id).catch(() => null) // Return null if reservation not found
          )
        );
        return reservations.filter((res): res is Reservation => res !== null);
      }
      if (accessMethod === 'phone' && phone) {
        return await getReservationsByPhone(phone);
      }
      if (accessMethod === 'user' && user?._id) {
        // For logged-in users, get all reservations and filter client-side
        // This allows us to show both incoming and outgoing reservations
        const allReservations = await getReservations();
        return allReservations.filter((res) => res.userId === user._id || res.customerId === user._id);
      }
      return [];
    },
    enabled: accessMethod !== 'none',
    placeholderData: keepPreviousData,
    initialData: () =>
      queryClient.getQueryData<Reservation[]>(['reservationsList', accessMethod, user?._id, phone, storedIds.join(',')])
  });

  // Filter reservations
  const filteredReservations = useMemo(() => {
    let filtered = [...allReservations];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((res) => res.status === filters.status);
    }

    // Filter by type (incoming/outgoing) - only relevant for studio owners
    // This will be enhanced in Phase 3 when we add studio owner logic
    if (filters.type && filters.type !== 'all') {
      // For now, all reservations are "outgoing" for regular users
      // Phase 3 will add incoming/outgoing distinction
    }

    return filtered;
  }, [allReservations, filters]);

  return {
    data: filteredReservations,
    allReservations,
    isLoading,
    error,
    refetch,
    accessMethod
  };
};
