import React from 'react';
import { GenericList } from '@shared/components';
import { ReservationCard } from './ReservationCard';
import { Reservation } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import './styles/_reservations-list.scss';

interface ReservationsListProps {
  reservations: Reservation[];
  isLoading?: boolean;
}

export const ReservationsList: React.FC<ReservationsListProps> = ({ reservations, isLoading }) => {
  const { t } = useTranslation('reservations');

  if (isLoading) {
    return (
      <div className="reservations-list reservations-list--loading">
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="reservations-list reservations-list--empty">
        <p className="reservations-list__empty-message">{t('noReservations')}</p>
      </div>
    );
  }

  const renderItem = (reservation: Reservation) => (
    <ReservationCard key={reservation._id} reservation={reservation} />
  );

  return (
    <section className="reservations-list">
      <GenericList
        data={reservations}
        renderItem={renderItem}
        className="reservations-list__grid"
      />
    </section>
  );
};

