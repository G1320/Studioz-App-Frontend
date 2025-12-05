import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReservation } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import dayjs from 'dayjs';
import './styles/_reservation-details-page.scss';

const ReservationDetailsPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const { t, i18n } = useTranslation('reservations');
  const langNavigate = useLanguageNavigate();

  const { data: reservation, isLoading, error } = useReservation(reservationId || '');

  const handleBack = () => {
    langNavigate('/reservations');
  };

  if (isLoading) {
    return (
      <div className="reservation-details-page">
        <div className="reservation-details-page__loading">
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="reservation-details-page">
        <div className="reservation-details-page__error">
          <p>{t('reservationNotFound')}</p>
          <button onClick={handleBack} className="reservation-details-page__back-button">
            {t('backToReservations')}
          </button>
        </div>
      </div>
    );
  }

  const startTime = reservation.timeSlots[0];
  const startDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
  const formattedStartTime = startDateTime.format('h:mm A');
  const formattedDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('MMMM DD, YYYY');

  const itemName =
    i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';

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
    <div className="reservation-details-page">
      <div className="reservation-details-page__header">
        <button onClick={handleBack} className="reservation-details-page__back-button">
          ← {t('back')}
        </button>
        <h1 className="reservation-details-page__title">{t('reservationDetails')}</h1>
      </div>

      <div className="reservation-details-page__content">
        <div className="reservation-details-page__section">
          <h2 className="reservation-details-page__section-title">{itemName}</h2>
        </div>

        <div className="reservation-details-page__section">
          <h3 className="reservation-details-page__section-title">{t('bookingInformation')}</h3>
          <div className="reservation-details-page__info-grid">
            <div className="reservation-details-page__info-row">
              <span className="reservation-details-page__info-label">{t('date')}:</span>
              <span className="reservation-details-page__info-value">{formattedDate}</span>
            </div>
            <div className="reservation-details-page__info-row">
              <span className="reservation-details-page__info-label">{t('time')}:</span>
              <span className="reservation-details-page__info-value">{formattedStartTime}</span>
            </div>
            <div className="reservation-details-page__info-row">
              <span className="reservation-details-page__info-label">{t('duration')}:</span>
              <span className="reservation-details-page__info-value">
                {reservation.timeSlots.length} {reservation.timeSlots.length === 1 ? t('hour') : t('hours')}
              </span>
            </div>
            <div className="reservation-details-page__info-row">
              <span className="reservation-details-page__info-label">{t('status')}:</span>
              <span className={`reservation-details-page__status-badge ${getStatusColor(reservation.status)}`}>
                {t(`status.${reservation.status}`)}
              </span>
            </div>
          </div>
        </div>

        {(reservation.customerName || reservation.customerPhone || reservation.comment) && (
          <div className="reservation-details-page__section">
            <h3 className="reservation-details-page__section-title">{t('customerInformation')}</h3>
            <div className="reservation-details-page__info-grid">
              {reservation.customerName && (
                <div className="reservation-details-page__info-row">
                  <span className="reservation-details-page__info-label">{t('name')}:</span>
                  <span className="reservation-details-page__info-value">{reservation.customerName}</span>
                </div>
              )}
              {reservation.customerPhone && (
                <div className="reservation-details-page__info-row">
                  <span className="reservation-details-page__info-label">{t('phone')}:</span>
                  <span className="reservation-details-page__info-value">{reservation.customerPhone}</span>
                </div>
              )}
              {reservation.comment && (
                <div className="reservation-details-page__info-row reservation-details-page__info-row--full">
                  <span className="reservation-details-page__info-label">{t('notes')}:</span>
                  <span className="reservation-details-page__info-value">{reservation.comment}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="reservation-details-page__section">
          <h3 className="reservation-details-page__section-title">{t('pricing')}</h3>
          <div className="reservation-details-page__info-grid">
            {reservation.itemPrice && (
              <div className="reservation-details-page__info-row">
                <span className="reservation-details-page__info-label">{t('pricePerHour')}:</span>
                <span className="reservation-details-page__info-value">₪{reservation.itemPrice}</span>
              </div>
            )}
            {reservation.totalPrice && (
              <div className="reservation-details-page__info-row">
                <span className="reservation-details-page__info-label">{t('total')}:</span>
                <span className="reservation-details-page__info-value reservation-details-page__price">
                  ₪{reservation.totalPrice}
                </span>
              </div>
            )}
            {reservation.orderId && (
              <div className="reservation-details-page__info-row">
                <span className="reservation-details-page__info-label">{t('orderId')}:</span>
                <span className="reservation-details-page__info-value">{reservation.orderId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsPage;
