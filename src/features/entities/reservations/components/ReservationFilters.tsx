import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownOption } from '@shared/components';
import './styles/_reservation-filters.scss';

export type ReservationStatusFilter = 'all' | 'pending' | 'confirmed' | 'expired' | 'cancelled' | 'rejected';
export type ReservationTypeFilter = 'all' | 'incoming' | 'outgoing';

interface ReservationFiltersProps {
  status: ReservationStatusFilter;
  type: ReservationTypeFilter;
  onStatusChange: (status: ReservationStatusFilter) => void;
  onTypeChange: (type: ReservationTypeFilter) => void;
  showTypeFilter?: boolean; // Only show for studio owners
  className?: string;
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  status,
  type,
  onStatusChange,
  onTypeChange,
  showTypeFilter = false,
  className = ''
}) => {
  const { t } = useTranslation('reservations');

  const statusOptions: DropdownOption[] = [
    { label: t('filters.status.all'), value: 'all' },
    { label: t('filters.status.pending'), value: 'pending' },
    { label: t('filters.status.confirmed'), value: 'confirmed' },
    { label: t('filters.status.expired'), value: 'expired' },
    { label: t('filters.status.cancelled'), value: 'cancelled' },
    { label: t('filters.status.rejected'), value: 'rejected' }
  ];

  const typeOptions: DropdownOption[] = [
    { label: t('filters.type.all'), value: 'all' },
    { label: t('filters.type.incoming'), value: 'incoming' },
    { label: t('filters.type.outgoing'), value: 'outgoing' }
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

        {showTypeFilter && (
          <div className="reservation-filters__filter">
            <label className="reservation-filters__label" htmlFor="type-filter">
              {t('filters.typeLabel')}
            </label>
            <select
              id="type-filter"
              className="reservation-filters__select"
              value={type}
              onChange={(e) => onTypeChange(e.target.value as ReservationTypeFilter)}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
