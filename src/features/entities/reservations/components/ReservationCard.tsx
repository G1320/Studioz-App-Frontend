import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCancelReservationMutation } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useReservationModal } from '@core/contexts/ReservationModalContext';
import { Reservation, Studio } from 'src/types/index';
import { CancelReservationConfirm } from './CancelReservationConfirm';
import dayjs from 'dayjs';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './styles/_reservation-card.scss';

interface ReservationCardProps {
  reservation: Reservation;
  variant?: 'list' | 'itemCard';
  onCancel?: () => void;
  onUpdate?: () => void;
  onConfirm?: () => void;
  userStudios?: Studio[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  variant = 'list',
  onCancel,
  onConfirm,
  userStudios = [],
  isExpanded: isExpandedProp,
  onToggleExpand
}) => {
  const { t, i18n } = useTranslation('reservations');
  const { user } = useUserContext();
  const { openReservationModal } = useReservationModal();
  const cancelMutation = useCancelReservationMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Use prop if provided, otherwise use internal state
  const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Check if user owns the studio for this item
  const userOwnsStudioForItem = useMemo(() => {
    if (!user?._id || userStudios.length === 0) return false;
    return userStudios.some((studio) => {
      if (!studio.items || studio.items.length === 0) return false;
      return studio.items.some((item) => item.itemId === reservation.itemId);
    });
  }, [user?._id, userStudios, reservation.itemId]);

  // Determine if this is an "incoming" reservation
  const isIncomingReservation = useMemo(() => {
    if (!user?._id) return false;
    const userMadeReservation = reservation.userId === user._id || reservation.customerId === user._id;
    return userOwnsStudioForItem && !userMadeReservation;
  }, [user?._id, userOwnsStudioForItem, reservation.userId, reservation.customerId]);

  const showCancelButton = !isIncomingReservation;
  const isCancelledStatus = reservation.status === 'cancelled' || reservation.status === 'rejected';

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

  const handleCardClick = () => {
    if (variant === 'list') {
      handleToggleExpand();
    }
  };

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

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    openReservationModal(reservation);
  };

  // Format data
  const startTime = reservation.timeSlots[0];
  const startDateTime = dayjs(`${reservation.bookingDate} ${startTime}`, 'DD/MM/YYYY HH:mm');
  const endDateTime = startDateTime.add(reservation.timeSlots.length, 'hour');
  const formattedStartTime = startDateTime.format('HH:mm');
  const formattedEndTime = endDateTime.format('HH:mm');
  const formattedTimeRange = `${formattedStartTime} - ${formattedEndTime}`;
  const formattedDate = dayjs(reservation.bookingDate, 'DD/MM/YYYY').format('DD MMM, YYYY');
  const duration = `${reservation.timeSlots.length} ${reservation.timeSlots.length === 1 ? t('hour') : t('hours')}`;

  // Status helpers
  const normalizedStatus = reservation.status?.toLowerCase() || 'pending';
  const isConfirmed = ['approved', 'confirmed', 'completed'].includes(normalizedStatus);
  const isPending = ['pending', 'waiting'].includes(normalizedStatus);
  const isCancelled = ['cancelled', 'rejected'].includes(normalizedStatus);

  const getStatusClass = () => {
    if (isConfirmed) return 'status--confirmed';
    if (isPending) return 'status--pending';
    if (isCancelled) return 'status--cancelled';
    return 'status--default';
  };

  const itemName =
    i18n.language === 'he' && reservation.itemName?.he ? reservation.itemName.he : reservation.itemName?.en || '';

  // Get studio name based on current language
  const studioName = reservation.studioName
    ? (i18n.language === 'he' ? reservation.studioName.he : reservation.studioName.en) ||
      reservation.studioName.en ||
      reservation.studioName.he ||
      null
    : null;

  const isClickable = variant === 'list';

  return (
    <article
      className={`reservation-card ${isExpanded ? 'reservation-card--expanded' : ''} ${variant === 'itemCard' ? 'reservation-card--item-card' : ''}`}
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-expanded={isExpanded}
    >
      {/* Summary View (Always Visible) */}
      <div className="reservation-card__summary">
        {/* Status Indicator */}
        <div className={`reservation-card__status-indicator ${getStatusClass()}`}>
          <div className="reservation-card__status-dot" />
        </div>

        {/* Main Info */}
        <div className="reservation-card__summary-content">
          <div className="reservation-card__summary-header">
            <h3 className="reservation-card__item-name">{itemName}</h3>
            <span className="reservation-card__price">₪{reservation.totalPrice || 0}</span>
          </div>

          {(studioName || reservation.address) && (
            <p className="reservation-card__subtitle">
              {t('reservationAt', 'הזמנה ב-')}
              {studioName || reservation.address}
            </p>
          )}

          <div className="reservation-card__summary-meta">
            <span className="reservation-card__meta-item">
              <CalendarTodayIcon className="reservation-card__meta-icon" />
              {formattedDate}
            </span>
            <span className="reservation-card__meta-item">
              <AccessTimeIcon className="reservation-card__meta-icon" />
              {formattedTimeRange}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={`reservation-card__expanded ${isExpanded ? 'reservation-card__expanded--open' : ''}`}>
        <div className="reservation-card__expanded-inner">
          <div className="reservation-card__details">
            {/* Status Row */}
            <div className="reservation-card__detail-row">
              <span className="reservation-card__label">{t('status')}:</span>
              <span className={`reservation-card__status-badge ${getStatusClass()}`}>
                {t(`status.${reservation.status}`)}
              </span>
            </div>

            {/* Duration */}
            <div className="reservation-card__detail-row">
              <span className="reservation-card__label">{t('duration')}:</span>
              <span className="reservation-card__value">{duration}</span>
            </div>

            {/* Client Name */}
            {reservation.customerName && (
              <div className="reservation-card__detail-row">
                <span className="reservation-card__label">{t('name')}:</span>
                <span className="reservation-card__value reservation-card__value--with-icon">
                  {reservation.customerName}
                  <PersonIcon className="reservation-card__detail-icon" />
                </span>
              </div>
            )}

            {/* Phone */}
            {reservation.customerPhone && (
              <div className="reservation-card__detail-row">
                <span className="reservation-card__label">{t('phone')}:</span>
                <span className="reservation-card__value reservation-card__value--with-icon reservation-card__value--mono">
                  {reservation.customerPhone}
                  <PhoneIcon className="reservation-card__detail-icon" />
                </span>
              </div>
            )}

            {/* Notes */}
            {reservation.comment && (
              <div className="reservation-card__detail-row reservation-card__detail-row--notes">
                <span className="reservation-card__label">{t('comment')}:</span>
                <p className="reservation-card__notes">{reservation.comment}</p>
              </div>
            )}

            {/* Add-ons indicator (if add-on IDs exist) */}
            {reservation.addOnIds && reservation.addOnIds.length > 0 && (
              <div className="reservation-card__addons">
                <div className="reservation-card__addons-header">
                  <InventoryIcon className="reservation-card__addons-icon" />
                  <span>{t('selectedAddOns', 'תוספות שנבחרו')}</span>
                </div>
                <div className="reservation-card__addon-count">
                  {reservation.addOnIds.length} {t('addOnsSelected', 'תוספות נבחרו')}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="reservation-card__actions">
            {showCancelButton && !showCancelConfirm && (
              <button
                className="reservation-card__action-btn reservation-card__action-btn--cancel"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={cancelMutation.isPending || isCancelledStatus}
              >
                <CancelIcon className="reservation-card__action-icon" />
                <span>{t('cancel', 'בטל')}</span>
              </button>
            )}

            {showCancelConfirm && (
              <div className="reservation-card__cancel-confirm-wrapper" onClick={(e) => e.stopPropagation()}>
                <CancelReservationConfirm
                  onConfirm={handleCancel}
                  onCancel={() => setShowCancelConfirm(false)}
                  isPending={cancelMutation.isPending}
                />
              </div>
            )}

            {!showCancelConfirm && (
              <>
                <button
                  className="reservation-card__action-btn reservation-card__action-btn--update"
                  onClick={handleOpenModal}
                >
                  <EditIcon className="reservation-card__action-icon" />
                  <span>{t('update', 'עדכן')}</span>
                </button>

                {isIncomingReservation && isPending && onConfirm && (
                  <button
                    className="reservation-card__action-btn reservation-card__action-btn--confirm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirm();
                    }}
                  >
                    <CheckCircleIcon className="reservation-card__action-icon" />
                    <span>{t('confirm', 'אשר')}</span>
                  </button>
                )}
              </>
            )}

            {variant === 'itemCard' && isCancelledStatus && (
              <button
                className="reservation-card__action-btn reservation-card__action-btn--secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNewReservation();
                }}
              >
                {t('reservations:createNewReservation', 'Create new reservation')}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
