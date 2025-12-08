import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/_reservation-details-header.scss';

interface ReservationDetailsHeaderProps {
  onBack: () => void;
}

export const ReservationDetailsHeader: React.FC<ReservationDetailsHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation('reservations');

  return (
    <header className="reservation-details-header">
      <button onClick={onBack} className="reservation-details-header__back" aria-label={t('back')}>
        <ArrowBackIcon />
      </button>
    </header>
  );
};

