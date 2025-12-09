import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReservations, getReservationsByPhone, getReservationById } from '@shared/services';
import { Reservation, Studio } from 'src/types/index';
import dayjs from 'dayjs';
import { getLocalUser } from '@shared/services';
import { useMemo } from 'react';
import { getStoredReservationIds } from '@shared/utils/reservation-storage';

interface UseReservationsListOptions {
  phone?: string;
  useStoredIds?: boolean; // If true, fetch reservations from localStorage IDs
  userStudios?: Studio[]; // User's studios for studio owner filtering
  filters?: {
    status?: 'pending' | 'confirmed' | 'expired' | 'cancelled' | 'rejected' | 'all';
    type?: 'incoming' | 'outgoing' | 'all';
    sort?: 'booking-desc' | 'booking-asc' | 'created-desc' | 'created-asc';
  };
}

export const useReservationsList = (options: UseReservationsListOptions = {}) => {
  const queryClient = useQueryClient();
  const user = getLocalUser();
  const { phone, useStoredIds = false, userStudios = [], filters = {} } = options;

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
        // For logged-in users, get all reservations
        // We'll filter by incoming/outgoing in the filtering logic below
        return await getReservations();
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

    // Determine if user is a studio owner
    const isStudioOwner = userStudios.length > 0 && user?._id;

    if (accessMethod === 'user' && user?._id) {
      if (isStudioOwner) {
        // For studio owners, separate incoming and outgoing
        const userStudioItemIds = new Set(userStudios.flatMap((studio) => studio.items.map((item) => item.itemId)));

        // Filter by type (incoming/outgoing)
        if (filters.type === 'incoming') {
          // Incoming: reservations for studio owner's items (not made by them)
          filtered = filtered.filter(
            (res) => userStudioItemIds.has(res.itemId) && res.userId !== user._id && res.customerId !== user._id
          );
        } else if (filters.type === 'outgoing') {
          // Outgoing: reservations made by the user
          filtered = filtered.filter((res) => res.userId === user._id || res.customerId === user._id);
        } else {
          // All: show both incoming and outgoing
          filtered = filtered.filter(
            (res) => userStudioItemIds.has(res.itemId) || res.userId === user._id || res.customerId === user._id
          );
        }
      } else {
        // Regular users: only show their own reservations
        filtered = filtered.filter((res) => res.userId === user._id || res.customerId === user._id);
      }
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((res) => res.status === filters.status);
    }

    // Sorting
    const sortOption = filters.sort || 'booking-desc';

    const bookingDateTime = (res: Reservation) => {
      if (!res.bookingDate) return null;
      const time = res.timeSlots?.[0];
      if (time) {
        const dt = dayjs(`${res.bookingDate} ${time}`, 'DD/MM/YYYY HH:mm');
        if (dt.isValid()) return dt;
      }
      const d = dayjs(res.bookingDate, 'DD/MM/YYYY');
      return d.isValid() ? d : null;
    };

    const createdDateTime = (res: Reservation) => {
      if (!res.createdAt) return null;
      const d = dayjs(res.createdAt);
      return d.isValid() ? d : null;
    };

    const compare = (x: dayjs.Dayjs | null, y: dayjs.Dayjs | null, direction: 'asc' | 'desc') => {
      if (!x && !y) return 0;
      if (!x) return 1;
      if (!y) return -1;
      return direction === 'asc' ? x.valueOf() - y.valueOf() : y.valueOf() - x.valueOf();
    };

    filtered.sort((a, b) => {
      const aBooking = bookingDateTime(a);
      const bBooking = bookingDateTime(b);
      const aCreated = createdDateTime(a);
      const bCreated = createdDateTime(b);

      switch (sortOption) {
        case 'booking-asc':
          return compare(aBooking, bBooking, 'asc');
        case 'created-desc':
          return compare(aCreated, bCreated, 'desc');
        case 'created-asc':
          return compare(aCreated, bCreated, 'asc');
        case 'booking-desc':
        default:
          return compare(aBooking, bBooking, 'desc');
      }
    });

    return filtered;
  }, [allReservations, filters, user?._id, userStudios, accessMethod]);

  return {
    data: filteredReservations,
    allReservations,
    isLoading,
    error,
    refetch,
    accessMethod
  };
};
