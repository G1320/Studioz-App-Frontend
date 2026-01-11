import {
  ReservationStatusFilter,
  ReservationSortOption
} from '@features/entities/reservations/hooks/useReservationFilters';

const STORAGE_KEY = 'reservations_filters';

export interface ReservationFiltersState {
  status?: ReservationStatusFilter;
  sort?: ReservationSortOption;
  type?: 'all' | 'incoming' | 'outgoing';
  customerPhone?: string;
}

export const loadReservationFilters = (): ReservationFiltersState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReservationFiltersState;
  } catch (e) {
    return null;
  }
};

export const saveReservationFilters = (partial: ReservationFiltersState) => {
  try {
    const existing = loadReservationFilters() || {};
    const next = { ...existing, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    // ignore persistence errors
  }
};
