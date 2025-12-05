import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { Reservation } from 'src/types/index';
import dayjs from 'dayjs';
import './styles/_reservation-card.scss';

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const { t, i18n } = useTranslation('reservations');
  const langNavigate = useLanguageNavigate();

  const handleCardClick = () => {
    langNavigate(`/reservations/${reservation._id}`);
  };

  const startTime = reservation.timeSlots[0];
  const startDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
  const formattedStartTime = startDateTime.format('h:mm A');
  const formattedDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('MMM DD, YYYY');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'expired':
        return 'status-expired';
      default:
        return '';
    }
  };

  const itemName = i18n.language === 'he' && reservation.itemName?.he 
    ? reservation.itemName.he 
    : reservation.itemName?.en || '';

  const studioName = reservation.studioName 
    ? (i18n.language === 'he' && reservation.studioName?.he 
        ? reservation.studioName.he 
        : reservation.studioName?.en || '')
    : null;

  return (
    <article className="reservation-card" onClick={handleCardClick}>
      <div className="reservation-card__content">
        <div className="reservation-card__header">
          <h3 className="reservation-card__item-name">{itemName}</h3>
        </div>

        {studioName && (
          <div className="reservation-card__studio-name">{studioName}</div>
        )}

        <div className="reservation-card__status-row">
          <span className={`reservation-card__status ${getStatusColor(reservation.status)}`}>
            {t(`status.${reservation.status}`)}
          </span>
        </div>

        <div className="reservation-card__details">
          <div className="reservation-card__detail-row">
            <span className="reservation-card__label">{t('date')}:</span>
            <span className="reservation-card__value">{formattedDate}</span>
          </div>
          <div className="reservation-card__detail-row">
            <span className="reservation-card__label">{t('time')}:</span>
            <span className="reservation-card__value">{formattedStartTime}</span>
          </div>
          <div className="reservation-card__detail-row">
            <span className="reservation-card__label">{t('duration')}:</span>
            <span className="reservation-card__value">
              {reservation.timeSlots.length} {reservation.timeSlots.length === 1 ? t('hour') : t('hours')}
            </span>
          </div>
          {reservation.customerName && (
            <div className="reservation-card__detail-row">
              <span className="reservation-card__label">{t('name')}:</span>
              <span className="reservation-card__value">{reservation.customerName}</span>
            </div>
          )}
          {reservation.customerPhone && (
            <div className="reservation-card__detail-row">
              <span className="reservation-card__label">{t('phone')}:</span>
              <span className="reservation-card__value">{reservation.customerPhone}</span>
            </div>
          )}
          {reservation.totalPrice && (
            <div className="reservation-card__detail-row">
              <span className="reservation-card__label">{t('total')}:</span>
              <span className="reservation-card__value reservation-card__price">₪{reservation.totalPrice}</span>
            </div>
          )}
        </div>

        <div className="reservation-card__actions">
          <button className="reservation-card__view-button" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
            {t('viewDetails')}
          </button>
        </div>
      </div>
    </article>
  );
};

