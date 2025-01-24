// components/ReservationDetails.tsx
import React from 'react';
import { useReservation } from '@shared/hooks';
import dayjs from 'dayjs';

interface ReservationDetailsProps {
  reservationId?: string;
  pricePer: string;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservationId, pricePer }) => {
  const { data: reservation } = useReservation(reservationId || '');

  if (!reservation) return null;

  const formattedDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('MMMM D, YYYY');

  const startTime = reservation.timeSlots[0];
  const startDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
  const endDateTime = startDateTime.add(reservation.timeSlots.length, 'hour');

  const formattedStartTime = startDateTime.format('h:mm A');
  const formattedEndTime = endDateTime.format('h:mm A');

  return (
    <div className="reservation-details">
      <div className="reservation-info">
        <div className="info-row">
          <span>Status:</span>
          <span className={`status-${reservation.status}`}>{reservation.status}</span>
        </div>
        <div className="info-row">
          <span>Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="info-row">
          <span>Time:</span>
          <span>
            {formattedStartTime} - {formattedEndTime}
          </span>
        </div>
        <div className="info-row">
          {pricePer === 'hour' && (
            <>
              <span>Duration:</span>
              <span>{reservation.timeSlots.length} hours</span>
            </>
          )}
        </div>
        {reservation.costumerName && (
          <div className="info-row">
            <span>Customer:</span>
            <span>{reservation.costumerName}</span>
          </div>
        )}
        {reservation.costumerPhone && (
          <div className="info-row">
            <span>Phone:</span>
            <span>{reservation.costumerPhone}</span>
          </div>
        )}
        {reservation.comment && (
          <div className="info-row">
            <span>Notes:</span>
            <span>{reservation.comment}</span>
          </div>
        )}
        {reservation.totalPrice && (
          <div className="info-row">
            <span>Total:</span>
            <span>₪{reservation.totalPrice}</span>
          </div>
        )}
        {reservation.orderId && (
          <div className="info-row">
            <span>Order ID:</span>
            <span>{reservation.orderId}</span>
          </div>
        )}
      </div>
    </div>
  );
};
