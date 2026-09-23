import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarTodayIcon,
  FilterIcon,
  SearchIcon,
  ClearIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@shared/components/icons';
import './styles/_reservation-filters.scss';
import {
  ReservationFilterOption,
  ReservationSortOption,
  ReservationStatusFilter
} from '@features/entities/reservations/hooks/useReservationFilters';

type SortField = 'created' | 'booking';
type SortDirection = 'asc' | 'desc';

interface ReservationFiltersProps {
  status: ReservationStatusFilter;
  onStatusChange: (status: ReservationStatusFilter) => void;
  sort: ReservationSortOption;
  onSortChange: (sort: ReservationSortOption) => void;
  statusOptions: ReservationFilterOption<ReservationStatusFilter>[];
  sortFieldOptions: ReservationFilterOption<SortField>[];
  className?: string;
  customerPhone?: string;
  onCustomerPhoneChange?: (phone: string) => void;
  showCustomerSearch?: boolean;
  trailing?: React.ReactNode;
}

function parseSort(sort: ReservationSortOption): { field: SortField; direction: SortDirection } {
  const [field, direction] = sort.split('-') as [SortField, SortDirection];
  return { field, direction };
}

function buildSort(field: SortField, direction: SortDirection): ReservationSortOption {
  return `${field}-${direction}` as ReservationSortOption;
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  status,
  onStatusChange,
  sort,
  onSortChange,
  statusOptions,
  sortFieldOptions,
  className = '',
  customerPhone = '',
  onCustomerPhoneChange,
  showCustomerSearch = false,
  trailing
}) => {
  const { t } = useTranslation('reservations');
  const { field, direction } = useMemo(() => parseSort(sort), [sort]);

  return (
    <div className={`reservation-filters ${className}`}>
      {showCustomerSearch && onCustomerPhoneChange ? (
        <div className="reservation-filters__search">
          <SearchIcon className="reservation-filters__search-icon" />
          <input
            id="customer-search"
            type="text"
            className="reservation-filters__search-input"
            placeholder={t('filters.customerSearchPlaceholder', { defaultValue: 'Phone or name...' })}
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            aria-label={t('filters.customerSearchLabel', { defaultValue: 'Search Customer' })}
          />
          {customerPhone.trim() ? (
            <button
              type="button"
              className="reservation-filters__clear-btn"
              onClick={() => onCustomerPhoneChange('')}
              aria-label={t('filters.clearSearch', { defaultValue: 'Clear search' })}
            >
              <ClearIcon />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="reservation-filters__sort">
        <div className="reservation-filters__select-wrap reservation-filters__select-wrap--sort">
          <CalendarTodayIcon className="reservation-filters__select-icon" />
          <select
            id="sort-filter"
            className="reservation-filters__select"
            value={field}
            onChange={(e) => onSortChange(buildSort(e.target.value as SortField, direction))}
            aria-label={t('filters.sortLabel')}
          >
            {sortFieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="reservation-filters__direction" role="group" aria-label={t('filters.sortLabel')}>
          <button
            type="button"
            className={`reservation-filters__direction-btn${direction === 'desc' ? ' reservation-filters__direction-btn--active' : ''}`}
            onClick={() => onSortChange(buildSort(field, 'desc'))}
            aria-label={t('filters.sort.descending')}
            aria-pressed={direction === 'desc'}
            title={t('filters.sort.descending')}
          >
            <ArrowDownIcon />
          </button>
          <button
            type="button"
            className={`reservation-filters__direction-btn${direction === 'asc' ? ' reservation-filters__direction-btn--active' : ''}`}
            onClick={() => onSortChange(buildSort(field, 'asc'))}
            aria-label={t('filters.sort.ascending')}
            aria-pressed={direction === 'asc'}
            title={t('filters.sort.ascending')}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>

      <div className="reservation-filters__select-wrap">
        <FilterIcon className="reservation-filters__select-icon" />
        <select
          id="status-filter"
          className="reservation-filters__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ReservationStatusFilter)}
          aria-label={t('filters.statusLabel')}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {trailing}
    </div>
  );
};
