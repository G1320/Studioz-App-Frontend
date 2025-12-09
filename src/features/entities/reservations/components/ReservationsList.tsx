import React from 'react';
import { GenericList } from '@shared/components';
import { ReservationCard } from './ReservationCard';
import { ReservationCardSkeleton } from './ReservationCardSkeleton';
import { EmptyReservationsState } from './EmptyReservationsState';
import { Reservation, Studio } from 'src/types/index';
import './styles/_reservations-list.scss';

interface ReservationsListProps {
  reservations: Reservation[];
  isLoading?: boolean;
  isStudioOwner?: boolean;
  viewType?: 'incoming' | 'outgoing' | 'all';
  hasFilters?: boolean;
  userStudios?: Studio[];
}

export const ReservationsList: React.FC<ReservationsListProps> = ({
  reservations,
  isLoading = false,
  isStudioOwner = false,
  viewType = 'all',
  hasFilters = false,
  userStudios = []
}) => {
  if (isLoading) {
    return (
      <section className="reservations-list reservations-list--loading">
        <div className="reservations-list__grid">
          {[...Array(3)].map((_, index) => (
            <ReservationCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (reservations.length === 0) {
    return (
      <section className="reservations-list reservations-list--empty">
        <EmptyReservationsState
          isStudioOwner={isStudioOwner}
          viewType={viewType}
          hasFilters={hasFilters}
        />
      </section>
    );
  }

  const renderItem = (reservation: Reservation) => (
    <ReservationCard key={reservation._id} reservation={reservation} userStudios={userStudios} />
  );

  return (
    <section className="reservations-list" aria-label="Reservations list">
      <GenericList
        data={reservations}
        renderItem={renderItem}
        className="reservations-list__grid"
      />
    </section>
  );
};

