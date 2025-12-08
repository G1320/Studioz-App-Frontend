import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useReservationsList, useStudios } from '@shared/hooks';
import { ReservationsList } from '../components/ReservationsList';
import { ReservationFilters, ReservationTypeToggle, ReservationViewType } from '../components';
import { hasStoredReservations } from '@shared/utils/reservation-storage';
import './styles/_my-reservations-page.scss';

const MyReservationsPage: React.FC = () => {
  const { t } = useTranslation('reservations');
  const { user } = useUserContext();
  const { data: allStudios = [] } = useStudios();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [viewType, setViewType] = useState<ReservationViewType>('all');

  // Check if user is logged in or has stored reservations
  const hasAccess = user?._id || hasStoredReservations();

  // Get user's studios to determine if they're a studio owner
  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return allStudios.filter((studio) => studio.createdBy === user._id);
  }, [allStudios, user?._id]);

  const isStudioOwner = userStudios.length > 0;

  // Try to use stored reservations first
  const { data: reservations, isLoading } = useReservationsList({
    useStoredIds: hasStoredReservations() && !user?._id,
    userStudios: isStudioOwner ? userStudios : [],
    filters: {
      status: statusFilter,
      type: typeFilter
    }
  });

  // Sync viewType with typeFilter for studio owners
  useEffect(() => {
    if (isStudioOwner) {
      setTypeFilter(viewType === 'all' ? 'all' : viewType);
    }
  }, [viewType, isStudioOwner]);

  return (
    <div className="my-reservations-page">
      <div className="my-reservations-page__header">
        <h1 className="my-reservations-page__title">{t('myReservations')}</h1>
        <p className="my-reservations-page__subtitle">
          {reservations.length === 0
            ? t('noReservationsSubtitle')
            : t('reservationsCount', { count: reservations.length })}
        </p>
      </div>

      {/* Studio Owner Toggle */}
      {isStudioOwner && user?._id && (
        <ReservationTypeToggle
          viewType={viewType}
          onViewTypeChange={setViewType}
          className="my-reservations-page__toggle"
        />
      )}

      {/* Filters */}
      {hasAccess && (
        <ReservationFilters
          status={statusFilter}
          type={typeFilter}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
          showTypeFilter={isStudioOwner}
          className="my-reservations-page__filters"
        />
      )}

      <ReservationsList
        reservations={reservations}
        isLoading={isLoading}
        isStudioOwner={isStudioOwner}
        viewType={viewType}
        hasFilters={statusFilter !== 'all' || typeFilter !== 'all'}
      />
    </div>
  );
};

export default MyReservationsPage;
