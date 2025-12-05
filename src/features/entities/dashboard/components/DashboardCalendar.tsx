import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@features/entities/bookings';
import { Studio } from 'src/types/index';
import Reservation from 'src/types/reservation';

interface DashboardCalendarProps {
  studios: Studio[];
  reservations: Reservation[];
  isStudioOwner?: boolean;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  studios,
  reservations,
  isStudioOwner = false
}) => {
  const { t } = useTranslation('dashboard');

  // For studio owners, show all studio reservations
  // For regular users, show their own reservations
  const calendarReservations = isStudioOwner
    ? reservations
    : reservations.filter((res) => res.userId || res.customerId); // Filter by current user ID

  // Get the first studio's availability for calendar business hours
  const primaryStudio = studios[0];
  const studioAvailability = primaryStudio?.studioAvailability;

  return (
    <div className="dashboard-calendar">
      <h2 className="dashboard-section-title">
        {isStudioOwner ? t('calendar.studioOwnerTitle') : t('calendar.userTitle')}
      </h2>
      <Calendar
        title=""
        studioAvailability={studioAvailability}
        studioReservations={calendarReservations}
      />
    </div>
  );
};

