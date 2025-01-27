import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReservation } from '@shared/hooks';
import dayjs from 'dayjs';

interface ReservationDetailsProps {
  reservationId?: string;
  pricePer: string;
  onClear?: () => void;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservationId, pricePer, onClear }) => {
  const { t } = useTranslation('reservationDetails');
  const { data: reservation } = useReservation(reservationId || '');

  if (!reservation) return null;

  const startTime = reservation.timeSlots[0];
  const startDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');

  const formattedStartTime = startDateTime.format('h:mm A');

  return (
    <div className="reservation-details">
      <div className="reservation-info">
        <div className="info-row">
          <span>{t('reservationDetails.date')}</span>
          <span>{reservation.bookingDate}</span>
        </div>
        <div className="info-row">
          <span>{t('reservationDetails.time')}</span>
          <span>{formattedStartTime}</span>
        </div>
        <div className="info-row">
          {pricePer === 'hour' && (
            <>
              <span>{t('reservationDetails.duration')}</span>
              <span>
                {reservation.timeSlots.length} {t('reservationDetails.hours')}
              </span>
            </>
          )}
        </div>
        {reservation.customerName && (
          <div className="info-row">
            <span>{t('reservationDetails.customer')}</span>
            <span>{reservation.customerName}</span>
          </div>
        )}
        {reservation.customerPhone && (
          <div className="info-row">
            <span>{t('reservationDetails.phone')}</span>
            <span>{reservation.customerPhone}</span>
          </div>
        )}
        {reservation.comment && (
          <div className="info-row">
            <span>{t('reservationDetails.notes')}</span>
            <span>{reservation.comment}</span>
          </div>
        )}
        {reservation.totalPrice && (
          <div className="info-row">
            <span>{t('reservationDetails.total')}</span>
            <span>₪{reservation.totalPrice}</span>
          </div>
        )}
        {reservation.orderId && (
          <div className="info-row">
            <span>{t('reservationDetails.orderId')}</span>
            <span>{reservation.orderId}</span>
          </div>
        )}
        <button
          className="clear-reservation-button"
          onClick={() => {
            localStorage.removeItem(`reservation_${reservationId}`);
            onClear?.();
          }}
        >
          {t('reservationDetails.clearReservationButton')}
        </button>
      </div>
    </div>
  );
};
