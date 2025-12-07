import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { useCancelReservationMutation } from '@shared/hooks';
import { Reservation } from 'src/types/index';
import dayjs from 'dayjs';
import './styles/_reservation-card.scss';

interface ReservationCardProps {
  reservation: Reservation;
  variant?: 'list' | 'itemCard'; // 'list' for ReservationsList, 'itemCard' for ItemDetails
  onCancel?: () => void; // Callback when cancel is clicked (for itemCard variant)
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, variant = 'list', onCancel }) => {
  const { t, i18n } = useTranslation('reservations');
  const langNavigate = useLanguageNavigate();
  const cancelMutation = useCancelReservationMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Guard against missing reservation data
  if (!reservation || !reservation.timeSlots || reservation.timeSlots.length === 0 || !reservation.bookingDate) {
    return null;
  }

  const handleCardClick = () => {
    // Only navigate when in list variant
    if (variant === 'list') {
      langNavigate(`/reservations/${reservation._id}`);
    }
  };

  const handleCancel = async () => {
    if (!showCancelConfirm) {
      setShowCancelConfirm(true);
      return;
    }

    try {
      await cancelMutation.mutateAsync(reservation._id);
      setShowCancelConfirm(false);
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
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

  const itemName =
    i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';

  const studioName = reservation.studioName
    ? i18n.language === 'he' && reservation.studioName?.he
      ? reservation.studioName.he
      : reservation.studioName?.en || ''
    : null;

  const cardContent = (
    <div className="reservation-card__content">
      <div className="reservation-card__header">
        <h3 className="reservation-card__item-name">{itemName}</h3>
      </div>

      {studioName && <div className="reservation-card__studio-name">{studioName}</div>}

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
        {variant === 'list' && (
          <button
            className="reservation-card__view-button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {t('viewDetails')}
          </button>
        )}

        {variant === 'itemCard' && (
          <>
            {!showCancelConfirm ? (
              <button
                className="reservation-card__cancel-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? t('cancelling') : t('cancelReservation')}
              </button>
            ) : (
              <div className="reservation-card__cancel-confirm">
                <p className="reservation-card__cancel-message">{t('confirmCancel')}</p>
                <div className="reservation-card__cancel-buttons">
                  <button
                    className="reservation-card__cancel-confirm-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    disabled={cancelMutation.isPending}
                  >
                    {t('confirm')}
                  </button>
                  <button
                    className="reservation-card__cancel-cancel-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCancelConfirm(false);
                    }}
                    disabled={cancelMutation.isPending}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // If list variant, make the whole card clickable
  if (variant === 'list') {
    return (
      <article
        className="reservation-card"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${itemName} reservation on ${formattedDate}`}
      >
        {cardContent}
      </article>
    );
  }

  // If itemCard variant, card is not clickable (just displays info)
  return <article className="reservation-card reservation-card--item-card">{cardContent}</article>;
};
