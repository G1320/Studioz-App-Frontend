import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useReservationsList } from '@shared/hooks';
import { ReservationsList } from '../components/ReservationsList';
import { PhoneAccessForm } from '../components/PhoneAccessForm';
import { getLocalUser } from '@shared/services';
import { hasStoredReservations, getStoredCustomerPhone } from '@shared/utils/reservation-storage';
import './styles/_my-reservations-page.scss';

const MyReservationsPage: React.FC = () => {
  const { t } = useTranslation('reservations');
  const { user } = useUserContext();
  const [phone, setPhone] = useState<string>('');
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  // Check if user is logged in or has stored reservations
  const hasAccess = user?._id || hasStoredReservations();

  // Try to use stored reservations first, then phone if needed
  const { data: reservations, isLoading, accessMethod, refetch } = useReservationsList({
    useStoredIds: hasStoredReservations() && !user?._id,
    phone: phone || undefined
  });

  // If no reservations found from stored IDs and user wants to see more, show phone form
  useEffect(() => {
    if (!user?._id && !hasStoredReservations() && reservations.length === 0 && !isLoading) {
      const storedPhone = getStoredCustomerPhone();
      if (storedPhone) {
        setPhone(storedPhone);
        setShowPhoneForm(false);
      } else {
        setShowPhoneForm(true);
      }
    }
  }, [user, reservations.length, isLoading]);

  const handlePhoneSubmit = (submittedPhone: string) => {
    setPhone(submittedPhone);
    setShowPhoneForm(false);
    refetch();
  };

  const handleShowMoreReservations = () => {
    setShowPhoneForm(true);
  };

  // Show phone form if explicitly requested or no access method available
  if (showPhoneForm && !user?._id) {
    return (
      <div className="my-reservations-page">
        <PhoneAccessForm onPhoneSubmit={handlePhoneSubmit} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="my-reservations-page">
      <div className="my-reservations-page__header">
        <h1 className="my-reservations-page__title">{t('myReservations')}</h1>
        <p className="my-reservations-page__subtitle">
          {reservations.length === 0
            ? t('noReservationsSubtitle')
            : t('reservationsCount', { count: reservations.length })}
        </p>
        {!user?._id && reservations.length > 0 && (
          <button 
            onClick={handleShowMoreReservations}
            className="my-reservations-page__show-more-button"
          >
            {t('viewAllReservations')}
          </button>
        )}
      </div>

      <ReservationsList reservations={reservations} isLoading={isLoading} />
    </div>
  );
};

export default MyReservationsPage;

