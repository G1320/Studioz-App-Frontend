import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCancelReservationMutation } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { Reservation, Studio } from 'src/types/index';
import { CancelReservationConfirm } from './CancelReservationConfirm';
import dayjs from 'dayjs';
import './styles/_reservation-card.scss';

interface ReservationCardProps {
  reservation: Reservation;
  variant?: 'list' | 'itemCard'; // 'list' for ReservationsList, 'itemCard' for ItemDetails
  onCancel?: () => void; // Callback when cancel is clicked (for itemCard variant)
  userStudios?: Studio[]; // User's studios to determine if they're a studio owner
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  variant = 'list',
  onCancel,
  userStudios = []
}) => {
  const { t, i18n } = useTranslation('reservations');
  const { user } = useUserContext();
  const { openReservationModal } = useReservationModal();
  const cancelMutation = useCancelReservationMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Check if user owns the studio for this item
  const userOwnsStudioForItem = useMemo(() => {
    if (!user?._id || userStudios.length === 0) return false;
    return userStudios.some((studio) => {
      if (!studio.items || studio.items.length === 0) return false;
      return studio.items.some((item) => item.itemId === reservation.itemId);
    });
  }, [user?._id, userStudios, reservation.itemId]);

  // Determine if this is an "incoming" reservation (someone else booked user's studio item)
  // vs "outgoing" (user made the booking themselves)
  const isIncomingReservation = useMemo(() => {
    if (!user?._id) return false;
    // It's incoming if user owns the studio AND didn't make the reservation
    const userMadeReservation = reservation.userId === user._id || reservation.customerId === user._id;
    return userOwnsStudioForItem && !userMadeReservation;
  }, [user?._id, userOwnsStudioForItem, reservation.userId, reservation.customerId]);

  // Only show cancel button if this is NOT an incoming reservation (i.e., user made the booking)
  const showCancelButton = !isIncomingReservation;

  const isCancelledStatus = reservation.status === 'cancelled' || reservation.status === 'rejected';

  // Guard against missing reservation data
  if (!reservation || !reservation.timeSlots || reservation.timeSlots.length === 0 || !reservation.bookingDate) {
    return null;
  }

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
  const endDateTime = startDateTime.add(reservation.timeSlots.length, 'hour');
  const formattedStartTime = startDateTime.format('HH:mm');
  const formattedEndTime = endDateTime.format('HH:mm');
  const formattedTimeRange = `${formattedStartTime} - ${formattedEndTime}`;
  const formattedDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('MMM DD, YYYY');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'expired':
        return 'status-expired';
      case 'cancelled':
        return 'status-cancelled';
      case 'rejected':
        return 'status-rejected';
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

  const handleCardClick = () => {
    if (variant === 'list') {
      openReservationModal(reservation);
    }
  };

  // Only make card clickable if modal is available and variant is 'list'
  const isClickable = variant === 'list';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleCreateNewReservation = () => {
    if (reservation?.itemId) {
      localStorage.removeItem(`reservation_${reservation.itemId}`);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const cardContent = (
    <div className="reservation-card__content">
      <div className="reservation-card__header">
        <h3 className="reservation-card__item-name">{itemName}</h3>
      </div>

      {studioName && <div className="reservation-card__studio-name">{studioName}</div>}
      {reservation.address && <div className="reservation-card__address">{reservation.address}</div>}

      <div className="reservation-card__details">
        <div className="reservation-card__detail-row">
          <span className="reservation-card__label">{t('status')}:</span>
          <span className={`reservation-card__value reservation-card__status ${getStatusColor(reservation.status)}`}>
            {t(`status.${reservation.status}`)}
          </span>
        </div>
        <div className="reservation-card__detail-row">
          <span className="reservation-card__label">{t('reservationDate')}:</span>
          <span className="reservation-card__value">
            {reservation.createdAt ? dayjs(reservation.createdAt).format('MMM DD, YYYY') : '—'}
          </span>
        </div>
        <div className="reservation-card__detail-row">
          <span className="reservation-card__label">{t('visitDate')}:</span>
          <span className="reservation-card__value">{formattedDate}</span>
        </div>

        <div className="reservation-card__detail-row">
          <span className="reservation-card__label">{t('duration')}:</span>
          <span className="reservation-card__value">
            {reservation.timeSlots.length} {reservation.timeSlots.length === 1 ? t('hour') : t('hours')}
          </span>
        </div>
        <div className="reservation-card__detail-row">
          <span className="reservation-card__label">{t('time')}:</span>
          <span className="reservation-card__value">{formattedTimeRange}</span>
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
        <div className="reservation-card__detail-row reservation-card__detail-row--comment">
          <span className="reservation-card__label">{t('comment')}:</span>
          <span className="reservation-card__value reservation-card__comment">{reservation.comment || '—'}</span>
        </div>
      </div>

      {showCancelButton && (
        <div className="reservation-card__actions">
          {!showCancelConfirm ? (
            <button
              className="reservation-card__cancel-button"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              disabled={cancelMutation.isPending || isCancelledStatus}
            >
              {cancelMutation.isPending ? t('cancelling') : t('cancelReservation')}
            </button>
          ) : (
            <CancelReservationConfirm
              onConfirm={handleCancel}
              onCancel={() => setShowCancelConfirm(false)}
              isPending={cancelMutation.isPending}
            />
          )}

          {variant === 'itemCard' && isCancelledStatus && (
            <button
              className="reservation-card__cancel-button reservation-card__cancel-button--secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleCreateNewReservation();
              }}
            >
              {t('reservations:createNewReservation', 'Create new reservation')}
            </button>
          )}
        </div>
      )}
    </div>
  );

  const typeBadge = (
    <span
      className={`reservation-card__type-badge ${
        isIncomingReservation
          ? 'reservation-card__type-badge--incoming'
          : 'reservation-card__type-badge--outgoing'
      }`}
    >
      {isIncomingReservation ? t('filters.type.incoming') : t('filters.type.outgoing')}
    </span>
  );

  if (variant === 'list') {
    return (
      <article
        className="reservation-card"
        onClick={isClickable ? handleCardClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? `${itemName} reservation on ${formattedDate}` : undefined}
      >
        {typeBadge}
        {cardContent}
      </article>
    );
  }

  // If itemCard variant, card is not clickable (just displays info)
  return <article className="reservation-card reservation-card--item-card">{cardContent}</article>;
};
