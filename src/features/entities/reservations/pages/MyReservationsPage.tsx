import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useReservationsList, useStudios } from '@shared/hooks';
import { ReservationsList } from '../components/ReservationsList';
import { ReservationFilters, ReservationTypeToggle, ReservationViewType } from '../components';
import { hasStoredReservations } from '@shared/utils/reservation-storage';
import { useReservationFilters } from '../hooks/useReservationFilters';
import { ViewModeToggle, PageHeader, type ViewMode } from '@shared/components';
import { EventIcon } from '@shared/components/icons';
import '../styles/_index.scss';

const RESERVATIONS_VIEW_MODE_KEY = 'reservations-view-mode';

const MyReservationsPage: React.FC = () => {
  const { t } = useTranslation('reservations');
  const { user } = useUserContext();
  const { data: allStudios = [] } = useStudios();

  const {
    status,
    setStatus,
    type,
    setType,
    sort,
    setSort,
    customerPhone,
    setCustomerPhone,
    statusOptions,
    sortFieldOptions
  } = useReservationFilters();
  const [viewType, setViewType] = useState<ReservationViewType>('all');
  const [layoutMode, setLayoutMode] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.localStorage.getItem(RESERVATIONS_VIEW_MODE_KEY) === 'list'
      ? 'list'
      : 'grid'
  );

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
      status,
      type,
      sort,
      customerPhone
    }
  });

  // Sync viewType with typeFilter for studio owners
  useEffect(() => {
    if (isStudioOwner) {
      setType(viewType === 'all' ? 'all' : viewType);
    }
  }, [viewType, isStudioOwner, setType]);

  const handleLayoutModeChange = (mode: ViewMode) => {
    setLayoutMode(mode);
    window.localStorage.setItem(RESERVATIONS_VIEW_MODE_KEY, mode);
  };

  return (
    <div className="my-reservations-page">
      <PageHeader icon={<EventIcon />} title={t('myReservations')} />

      <div className="my-reservations-page__toolbar">
        {isStudioOwner && user?._id && (
          <ReservationTypeToggle
            viewType={viewType}
            onViewTypeChange={setViewType}
            className="my-reservations-page__toggle"
          />
        )}

        {hasAccess && (
          <ReservationFilters
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
            statusOptions={statusOptions}
            sortFieldOptions={sortFieldOptions}
            className="my-reservations-page__filters"
            customerPhone={customerPhone}
            onCustomerPhoneChange={setCustomerPhone}
            showCustomerSearch={isStudioOwner}
            trailing={
              <ViewModeToggle
                value={layoutMode}
                onChange={handleLayoutModeChange}
                label={t('view.label')}
                gridLabel={t('view.grid')}
                listLabel={t('view.list')}
                className="my-reservations-page__view-toggle"
              />
            }
          />
        )}
      </div>

      <ReservationsList
        reservations={reservations}
        isLoading={isLoading}
        isStudioOwner={isStudioOwner}
        viewType={viewType}
        hasFilters={status !== 'all' || type !== 'all' || !!customerPhone}
        userStudios={userStudios}
        layoutMode={layoutMode}
      />
    </div>
  );
};

export default MyReservationsPage;
