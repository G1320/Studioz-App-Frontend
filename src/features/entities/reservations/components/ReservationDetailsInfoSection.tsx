import React from 'react';
import { useTranslation } from 'react-i18next';
import { Reservation } from 'src/types/index';
import dayjs from 'dayjs';
import './styles/_reservation-details-info-section.scss';

interface ReservationDetailsInfoSectionProps {
  reservation: Reservation;
}

export const ReservationDetailsInfoSection: React.FC<ReservationDetailsInfoSectionProps> = ({ reservation }) => {
  const { t, i18n } = useTranslation('reservations');

  const startTime = reservation.timeSlots[0];
  const startDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
  const formattedStartTime = startDateTime.format('h:mm A');
  const formattedDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('MMMM DD, YYYY');

  const itemName =
    i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';

  const studioName = reservation.studioName
    ? i18n.language === 'he' && reservation.studioName?.he
      ? reservation.studioName.he
      : reservation.studioName?.en || ''
    : null;

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

  return (
    <div className="reservation-details-info">
      {/* Hero Section */}
      <div className="reservation-details-info__hero">
        <div className="reservation-details-info__hero-content">
          <h1 className="reservation-details-info__title">{itemName}</h1>
          {studioName && <p className="reservation-details-info__subtitle">{studioName}</p>}
        </div>
        <div className={`reservation-details-info__status ${getStatusColor(reservation.status)}`}>
          {t(`status.${reservation.status}`)}
        </div>
      </div>

      {/* Details Grid */}
      <div className="reservation-details-info__details">
        <div className="reservation-details-info__detail-item">
          <span className="reservation-details-info__detail-label">{t('date')}</span>
          <span className="reservation-details-info__detail-value">{formattedDate}</span>
        </div>
        <div className="reservation-details-info__detail-item">
          <span className="reservation-details-info__detail-label">{t('time')}</span>
          <span className="reservation-details-info__detail-value">{formattedStartTime}</span>
        </div>
        <div className="reservation-details-info__detail-item">
          <span className="reservation-details-info__detail-label">{t('duration')}</span>
          <span className="reservation-details-info__detail-value">
            {reservation.timeSlots.length} {reservation.timeSlots.length === 1 ? t('hour') : t('hours')}
          </span>
        </div>
        {reservation.customerName && (
          <div className="reservation-details-info__detail-item">
            <span className="reservation-details-info__detail-label">{t('name')}</span>
            <span className="reservation-details-info__detail-value">{reservation.customerName}</span>
          </div>
        )}
        {reservation.customerPhone && (
          <div className="reservation-details-info__detail-item">
            <span className="reservation-details-info__detail-label">{t('phone')}</span>
            <span className="reservation-details-info__detail-value">{reservation.customerPhone}</span>
          </div>
        )}
        {reservation.itemPrice && (
          <div className="reservation-details-info__detail-item">
            <span className="reservation-details-info__detail-label">{t('pricePerHour')}</span>
            <span className="reservation-details-info__detail-value">₪{reservation.itemPrice}</span>
          </div>
        )}
        {reservation.totalPrice && (
          <div className="reservation-details-info__detail-item reservation-details-info__detail-item--highlight">
            <span className="reservation-details-info__detail-label">{t('total')}</span>
            <span className="reservation-details-info__detail-value reservation-details-info__detail-value--price">
              ₪{reservation.totalPrice}
            </span>
          </div>
        )}
        {reservation.orderId && (
          <div className="reservation-details-info__detail-item">
            <span className="reservation-details-info__detail-label">{t('orderId')}</span>
            <span className="reservation-details-info__detail-value">{reservation.orderId}</span>
          </div>
        )}
        {reservation.comment && (
          <div className="reservation-details-info__detail-item reservation-details-info__detail-item--full">
            <span className="reservation-details-info__detail-label">{t('notes')}</span>
            <span className="reservation-details-info__detail-value">{reservation.comment}</span>
          </div>
        )}
      </div>
    </div>
  );
};

