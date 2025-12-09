import { useEffect, useMemo, useState } from 'react';
import { loadReservationFilters, saveReservationFilters } from '@shared/utils/reservation-filters-storage';

export type ReservationStatusFilter = 'all' | 'pending' | 'confirmed' | 'expired' | 'cancelled' | 'rejected';
export type ReservationTypeFilter = 'all' | 'incoming' | 'outgoing';
export type ReservationSortOption = 'booking-desc' | 'booking-asc' | 'created-desc' | 'created-asc';

export interface ReservationFilterOption<T extends string> {
  labelKey: string;
  value: T;
}

export const useReservationFilters = () => {
  const persisted = loadReservationFilters();

  const [status, setStatus] = useState<ReservationStatusFilter>(persisted?.status ?? 'all');
  const [type, setType] = useState<ReservationTypeFilter>(persisted?.type ?? 'all');
  const [sort, setSort] = useState<ReservationSortOption>(persisted?.sort ?? 'created-desc');

  useEffect(() => {
    saveReservationFilters({ status, type, sort });
  }, [status, type, sort]);

  const statusOptions: ReservationFilterOption<ReservationStatusFilter>[] = useMemo(
    () => [
      { labelKey: 'filters.status.all', value: 'all' },
      { labelKey: 'filters.status.pending', value: 'pending' },
      { labelKey: 'filters.status.confirmed', value: 'confirmed' },
      { labelKey: 'filters.status.expired', value: 'expired' },
      { labelKey: 'filters.status.cancelled', value: 'cancelled' }
    ],
    []
  );

  const sortOptions: ReservationFilterOption<ReservationSortOption>[] = useMemo(
    () => [
      { labelKey: 'filters.sort.createdDesc', value: 'created-desc' },
      { labelKey: 'filters.sort.createdAsc', value: 'created-asc' },
      { labelKey: 'filters.sort.bookingAsc', value: 'booking-asc' },
      { labelKey: 'filters.sort.bookingDesc', value: 'booking-desc' }
    ],
    []
  );

  return {
    status,
    setStatus,
    type,
    setType,
    sort,
    setSort,
    statusOptions,
    sortOptions
  };
};
