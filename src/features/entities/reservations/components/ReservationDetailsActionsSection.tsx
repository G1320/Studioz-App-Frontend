import React from 'react';
import { useTranslation } from 'react-i18next';
import { Reservation, Studio } from 'src/types/index';
import { ReservationActions } from './ReservationActions';
import './styles/_reservation-details-actions-section.scss';

interface ReservationDetailsActionsSectionProps {
  reservation: Reservation;
  userStudios?: Studio[];
  onCancel?: () => void;
}

export const ReservationDetailsActionsSection: React.FC<ReservationDetailsActionsSectionProps> = ({
  reservation,
  userStudios = [],
  onCancel
}) => {
  const { t } = useTranslation('reservations');

  return (
    <div className="reservation-details-actions-section">
      <h3 className="reservation-details-actions-section__title">{t('actions')}</h3>
      <ReservationActions reservation={reservation} userStudios={userStudios} onCancel={onCancel} />
    </div>
  );
};

