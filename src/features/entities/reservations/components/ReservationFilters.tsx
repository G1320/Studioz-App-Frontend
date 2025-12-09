import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownOption } from '@shared/components';
import './styles/_reservation-filters.scss';

export type ReservationStatusFilter = 'all' | 'pending' | 'confirmed' | 'expired' | 'cancelled' | 'rejected';
export type ReservationSortOption = 'booking-desc' | 'booking-asc' | 'created-desc' | 'created-asc';

interface ReservationFiltersProps {
  status: ReservationStatusFilter;
  onStatusChange: (status: ReservationStatusFilter) => void;
  sort: ReservationSortOption;
  onSortChange: (sort: ReservationSortOption) => void;

  className?: string;
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  status,
  onStatusChange,
  sort,
  onSortChange,

  className = ''
}) => {
  const { t } = useTranslation('reservations');

  const statusOptions: DropdownOption[] = [
    { label: t('filters.status.all'), value: 'all' },
    { label: t('filters.status.pending'), value: 'pending' },
    { label: t('filters.status.confirmed'), value: 'confirmed' },
    { label: t('filters.status.expired'), value: 'expired' },
    { label: t('filters.status.cancelled'), value: 'cancelled' }
  ];

  const sortOptions: DropdownOption[] = [
    { label: t('filters.sort.bookingDesc'), value: 'booking-desc' },
    { label: t('filters.sort.bookingAsc'), value: 'booking-asc' },
    { label: t('filters.sort.createdDesc'), value: 'created-desc' },
    { label: t('filters.sort.createdAsc'), value: 'created-asc' }
  ];

  return (
    <div className={`reservation-filters ${className}`}>
      <div className="reservation-filters__container">
        <div className="reservation-filters__filter">
          <label className="reservation-filters__label" htmlFor="status-filter">
            {t('filters.statusLabel')}
          </label>
          <select
            id="status-filter"
            className="reservation-filters__select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ReservationStatusFilter)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="reservation-filters__filter">
          <label className="reservation-filters__label" htmlFor="sort-filter">
            {t('filters.sortLabel')}
          </label>
          <select
            id="sort-filter"
            className="reservation-filters__select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ReservationSortOption)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
