import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@shared/components';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';

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
    <EmptyState
      icon="📅"
      title={getMessage()}
      subtitle={getSubtitle()}
      actionLabel={t('emptyStates.browseStudios')}
      onAction={() => langNavigate('/')}
      hideAction={hasFilters}
    />
  );
};
