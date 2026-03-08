import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@features/entities/bookings';
import { CalendarIcon } from '@shared/components/icons';
import { Studio } from 'src/types/index';
import Reservation from 'src/types/reservation';

interface DashboardCalendarProps {
  studios: Studio[];
  reservations: Reservation[];
  isStudioOwner?: boolean;
  onNewReservation?: () => void;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  studios,
  reservations,
  isStudioOwner = false,
  onNewReservation
}) => {
  const { t, i18n } = useTranslation('dashboard');
  const [selectedStudioId, setSelectedStudioId] = useState<string>(studios[0]?._id || '');

  const getLocalizedName = (name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  };

  const selectedStudio = useMemo(
    () => studios.find((s) => s._id === selectedStudioId) || studios[0],
    [studios, selectedStudioId]
  );

  const calendarReservations = useMemo(() => {
    if (!isStudioOwner) {
      return reservations.filter((res) => res.userId || res.customerId);
    }
    if (selectedStudio) {
      return reservations.filter((res) => res.studioId === selectedStudio._id);
    }
    return reservations;
  }, [reservations, isStudioOwner, selectedStudio]);

  const hasMultipleStudios = studios.length > 1;

  return (
    <div className="dashboard-calendar">
      <h2 className="dashboard-section-title">
        <CalendarIcon className="dashboard-section-title__icon" />
        {isStudioOwner ? t('calendar.studioOwnerTitle') : t('calendar.userTitle')}
      </h2>

      {hasMultipleStudios && (
        <div className="dashboard-calendar__studio-selector">
          {studios.map((studio) => (
            <button
              key={studio._id}
              type="button"
              className={`dashboard-calendar__studio-tab ${selectedStudioId === studio._id ? 'dashboard-calendar__studio-tab--active' : ''}`}
              onClick={() => setSelectedStudioId(studio._id)}
            >
              {studio.coverImage && (
                <img
                  src={studio.coverImage}
                  alt=""
                  className="dashboard-calendar__studio-tab-img"
                />
              )}
              <span>{getLocalizedName(studio.name)}</span>
            </button>
          ))}
        </div>
      )}

      <Calendar
        title={hasMultipleStudios ? '' : ''}
        studioAvailability={selectedStudio?.studioAvailability}
        studioReservations={calendarReservations}
        userStudios={studios}
        onNewEvent={onNewReservation}
      />
    </div>
  );
};

