import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles/_reservation-card.scss';

interface CancelReservationConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export const CancelReservationConfirm: React.FC<CancelReservationConfirmProps> = ({
  onConfirm,
  onCancel,
  isPending = false
}) => {
  const { t } = useTranslation('reservations');

  return (
    <div
      className="reservation-card__cancel-confirm"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="reservation-card__cancel-message">{t('confirmCancel')}</p>
      <div className="reservation-card__cancel-buttons">
        <button
          className="reservation-card__cancel-confirm-button"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          disabled={isPending}
        >
          {t('confirm')}
        </button>
        <button
          className="reservation-card__cancel-cancel-button"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          disabled={isPending}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

