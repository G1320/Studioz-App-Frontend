import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import './styles/_empty-reservations-state.scss';

interface EmptyReservationsStateProps {
  isStudioOwner?: boolean;
  viewType?: 'incoming' | 'outgoing' | 'all';
  hasFilters?: boolean;
}

export const EmptyReservationsState: React.FC<EmptyReservationsStateProps> = ({
  isStudioOwner = false,
  viewType = 'all',
  hasFilters = false
}) => {
  const { t } = useTranslation('reservations');
  const langNavigate = useLanguageNavigate();

  const getMessage = () => {
    if (hasFilters) {
      return t('emptyStates.noMatchingFilters');
    }
    if (isStudioOwner) {
      if (viewType === 'incoming') {
        return t('emptyStates.noIncomingReservations');
      }
      if (viewType === 'outgoing') {
        return t('emptyStates.noOutgoingReservations');
      }
    }
    return t('emptyStates.noReservations');
  };

  const getSubtitle = () => {
    if (hasFilters) {
      return t('emptyStates.tryDifferentFilters');
    }
    if (isStudioOwner && viewType === 'incoming') {
      return t('emptyStates.noBookingsForStudios');
    }
    return t('emptyStates.bookYourFirstSession');
  };

  return (
    <div className="empty-reservations-state">
      <div className="empty-reservations-state__icon">📅</div>
      <h3 className="empty-reservations-state__title">{getMessage()}</h3>
      <p className="empty-reservations-state__subtitle">{getSubtitle()}</p>
      {!hasFilters && (
        <button
          className="empty-reservations-state__button"
          onClick={() => langNavigate('/studios')}
          aria-label={t('emptyStates.browseStudios')}
        >
          {t('emptyStates.browseStudios')}
        </button>
      )}
    </div>
  );
};
