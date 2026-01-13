import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarTodayIcon,
  FilterIcon,
  SearchIcon,
  ClearIcon
} from '@shared/components/icons';
import './styles/_reservation-filters.scss';
import {
  ReservationFilterOption,
  ReservationSortOption,
  ReservationStatusFilter
} from '@features/entities/reservations/hooks/useReservationFilters';

interface ReservationFiltersProps {
  status: ReservationStatusFilter;
  onStatusChange: (status: ReservationStatusFilter) => void;
  sort: ReservationSortOption;
  onSortChange: (sort: ReservationSortOption) => void;
  statusOptions: ReservationFilterOption<ReservationStatusFilter>[];
  sortOptions: ReservationFilterOption<ReservationSortOption>[];
  className?: string;
  // Customer search (for incoming reservations)
  customerPhone?: string;
  onCustomerPhoneChange?: (phone: string) => void;
  showCustomerSearch?: boolean;
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  status,
  onStatusChange,
  sort,
  onSortChange,
  statusOptions,
  sortOptions,
  className = '',
  customerPhone = '',
  onCustomerPhoneChange,
  showCustomerSearch = false
}) => {
  const { t } = useTranslation('reservations');

  return (
    <div className={`reservation-filters ${className}`}>
      <div className="reservation-filters__container">
        {/* Customer Search (for incoming reservations) */}
        {showCustomerSearch && onCustomerPhoneChange && (
          <div className="reservation-filters__filter reservation-filters__filter--search">
            <label className="reservation-filters__label" htmlFor="customer-search">
              {t('filters.customerSearchLabel', { defaultValue: 'Search Customer' })}
            </label>
            <div className="reservation-filters__search-wrapper">
              <SearchIcon className="reservation-filters__search-icon" />
              <input
                id="customer-search"
                type="text"
                className="reservation-filters__search-input"
                placeholder={t('filters.customerSearchPlaceholder', { defaultValue: 'Phone or name...' })}
                value={customerPhone}
                onChange={(e) => onCustomerPhoneChange(e.target.value)}
              />
              {customerPhone.trim() && (
                <button
                  type="button"
                  className="reservation-filters__clear-btn"
                  onClick={() => onCustomerPhoneChange('')}
                  aria-label={t('filters.clearSearch', { defaultValue: 'Clear search' })}
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sort Filter */}
        <div className="reservation-filters__filter">
          <label className="reservation-filters__label" htmlFor="sort-filter">
            {t('filters.sortLabel')}
          </label>
          <div className="reservation-filters__select-wrapper">
            <select
              id="sort-filter"
              className="reservation-filters__select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ReservationSortOption)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
            <CalendarTodayIcon className="reservation-filters__icon" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="reservation-filters__filter">
          <label className="reservation-filters__label" htmlFor="status-filter">
            {t('filters.statusLabel')}
          </label>
          <div className="reservation-filters__select-wrapper">
          <select
            id="status-filter"
            className="reservation-filters__select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ReservationStatusFilter)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
            <FilterIcon className="reservation-filters__icon" />
        </div>
        </div>
      </div>
    </div>
  );
};
