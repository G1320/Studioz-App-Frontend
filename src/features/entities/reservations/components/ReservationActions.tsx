import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useCancelReservationMutation } from '@shared/hooks';
import { Reservation, Studio } from 'src/types/index';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { getStoredCustomerPhone } from '@shared/utils/reservation-storage';
import dayjs from 'dayjs';
import './styles/_reservation-actions.scss';

interface ReservationActionsProps {
  reservation: Reservation;
  userStudios?: Studio[];
  onCancel?: () => void;
}

export const ReservationActions: React.FC<ReservationActionsProps> = ({ reservation, userStudios = [], onCancel }) => {
  const { t } = useTranslation('reservations');
  const { user } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const cancelMutation = useCancelReservationMutation();

  // Check if user is the reservation owner (logged in)
  const isLoggedInOwner = useMemo(() => {
    if (!user?._id) return false;

    // Check multiple possible fields that could indicate ownership
    const userIdMatch = reservation.userId === user._id;
    const customerIdMatch = reservation.customerId === user._id;
    const customerPhoneMatch = user.phone && reservation.customerPhone && user.phone === reservation.customerPhone;

    return userIdMatch || customerIdMatch || customerPhoneMatch;
  }, [user?._id, user?.phone, reservation.userId, reservation.customerId, reservation.customerPhone]);

  // Check if non-logged-in user owns this reservation (by phone)
  const storedPhone = getStoredCustomerPhone();
  const isPhoneOwner = useMemo(() => {
    if (user?._id) return false; // If logged in, use logged-in check
    return storedPhone && reservation.customerPhone && reservation.customerPhone === storedPhone;
  }, [user?._id, storedPhone, reservation.customerPhone]);

  // Check if user is studio owner for this reservation
  // Method 1: Check if reservation itemId matches any item in user's studios
  const isStudioOwnerForReservation = useMemo(() => {
    if (!user?._id || userStudios.length === 0) return false;

    // Check if any of the user's studios contain the reservation's item
    return userStudios.some((studio) => {
      if (!studio.items || studio.items.length === 0) return false;
      return studio.items.some((item) => item.itemId === reservation.itemId);
    });
  }, [user?._id, userStudios, reservation.itemId]);

  // Method 2: Check if user has studios (fallback for studio owners)
  // This ensures studio owners can at least see contact actions
  const hasStudios = useMemo(() => {
    return user?.studios && user.studios.length > 0;
  }, [user?.studios]);

  // Combined studio owner check - if user has studios, show actions
  // This is a more permissive check for studio owners
  const isStudioOwner = isStudioOwnerForReservation || hasStudios;

  // Combined check for reservation owner
  // If user is studio owner of this reservation, they're also considered the reservation owner
  // (since they likely made the booking for their own studio)
  // Note: isStudioOwnerForReservation already checks for user?._id, so we can use it directly
  const isReservationOwner = isLoggedInOwner || isPhoneOwner || isStudioOwnerForReservation;

  // Check if reservation can be cancelled
  const canCancel =
    (reservation.status === 'pending' || reservation.status === 'confirmed') &&
    !dayjs(reservation.bookingDate).isBefore(dayjs(), 'day');

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
      } else {
        langNavigate('/reservations');
      }
    } catch (error) {
      // Error is handled by mutation handler
    }
  };

  const handleContact = () => {
    if (isStudioOwner && reservation.customerPhone) {
      window.location.href = `tel:${reservation.customerPhone}`;
    } else if (reservation.studioName) {
      // For regular users, contact studio (would need studio phone from reservation or item)
      // For now, we'll just show a message
      alert(t('contactStudioMessage'));
    }
  };

  const canModify = reservation.status === 'pending' && isReservationOwner;

  // Always show actions section - show buttons with appropriate states
  // This ensures users can see what actions are available
  const shouldShowContact = isStudioOwner || isReservationOwner;

  return (
    <div className="reservation-actions" data-testid="reservation-actions">
      {/* Cancel button - only for reservation owners (including studio owners who made the booking) */}
      {isReservationOwner && (
        <>
          {canCancel ? (
            !showCancelConfirm ? (
              <button
                className="reservation-actions__button reservation-actions__button--cancel"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                aria-label={t('cancelReservation')}
              >
                {cancelMutation.isPending ? t('cancelling') : t('cancelReservation')}
              </button>
            ) : (
              <div className="reservation-actions__confirm">
                <p className="reservation-actions__confirm-message">{t('confirmCancel')}</p>
                <div className="reservation-actions__confirm-buttons">
                  <button
                    className="reservation-actions__button reservation-actions__button--confirm"
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                  >
                    {t('confirm')}
                  </button>
                  <button
                    className="reservation-actions__button reservation-actions__button--secondary"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelMutation.isPending}
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            )
          ) : (
            <button
              className="reservation-actions__button reservation-actions__button--cancel"
              disabled
              aria-label={t('cancelReservation')}
            >
              {t('cancelReservation')} ({t('notAvailable')})
            </button>
          )}
        </>
      )}

      {/* Modify button - only for reservation owners with pending status */}
      {isReservationOwner && canModify && (
        <button
          className="reservation-actions__button reservation-actions__button--modify"
          onClick={() => {
            // Navigate to modify page or show modal
            langNavigate(`/item/${reservation.itemId}`);
          }}
          aria-label={t('modifyReservation')}
        >
          {t('modifyReservation')}
        </button>
      )}

      {/* Contact button - for both owners and studio owners */}
      {shouldShowContact && (
        <button
          className="reservation-actions__button reservation-actions__button--contact"
          onClick={handleContact}
          aria-label={t('contact')}
          data-testid="contact-button"
        >
          {isStudioOwner ? t('contactCustomer') : t('contactStudio')}
        </button>
      )}

      {/* Show message if no actions available */}
      {!isReservationOwner && !isStudioOwner && (
        <p className="reservation-actions__no-access">{t('noActionsAvailable')}</p>
      )}
    </div>
  );
};
