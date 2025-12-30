import React from 'react';
import { useTranslation } from 'react-i18next';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
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
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  status,
  onStatusChange,
  sort,
  onSortChange,
  statusOptions,
  sortOptions,
  className = ''
}) => {
  const { t } = useTranslation('reservations');

  return (
    <div className={`reservation-filters ${className}`}>
      <div className="reservation-filters__container">
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
            <FilterListIcon className="reservation-filters__icon" />
          </div>
        </div>
      </div>
    </div>
  );
};
