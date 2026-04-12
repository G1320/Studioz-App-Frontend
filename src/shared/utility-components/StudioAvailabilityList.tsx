import './styles/_index.scss';
import React, { useMemo } from 'react';
import { StudioAvailability, DayOfWeek } from 'src/types/studio';
import { useDays } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import { ClockIcon } from '@shared/components/icons';
import { PopupDropdown } from '@shared/components/drop-downs';
import { GenericList } from '@shared/components';

export interface StudioAvailabilityListProps {
  availability: StudioAvailability;
  variant?: 'popup' | 'list';
}

export const StudioAvailabilityList: React.FC<StudioAvailabilityListProps> = ({ availability, variant = 'popup' }) => {
  const { i18n } = useTranslation();
  const { getDisplayByEnglish } = useDays();

  const formattedAvailability = useMemo(() => {
    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const formatTimeRange = (start?: string, end?: string, isHebrew?: boolean) => {
      if (start && end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;
        const duration = (endMin - startMin + 1440) % 1440;
        const is24 = duration >= 1439
          || ((start === '00:00' || start === '0:00') && (end === '24:00' || end === '00:00' || end === '0:00'));

        if (is24) return isHebrew ? '24 שעות' : '24 Hours';
      }
      return isHebrew ? `${end} - ${start}` : `${start} - ${end}`;
    };

    return allDays.map((day) => {
      const index = availability?.days?.indexOf(day) ?? -1;
      if (index === -1) {
        return { day, displayDay: getDisplayByEnglish(day), hours: i18n.language === 'he' ? 'סגור' : 'Closed' };
      }
      const timeSlot = availability.times[index];
      const hours = formatTimeRange(timeSlot?.start, timeSlot?.end, i18n.language === 'he');
      return {
        day,
        displayDay: getDisplayByEnglish(day),
        hours
      };
    });
  }, [availability, getDisplayByEnglish, i18n.language]);

  const renderItem = (item: { displayDay: string; hours: string }) => (
    <li className="availability-list-item">
      <strong>{item.displayDay}:</strong>
      <p>{item.hours}</p>
    </li>
  );

  const listContent = (
    <GenericList
      data={formattedAvailability}
      renderItem={renderItem}
      keyExtractor={(item) => item.day}
      className="availability-dropdown-list"
    />
  );

  if (variant === 'list') {
    return <div className="availability-list-container">{listContent}</div>;
  }

  return (
    <PopupDropdown
      trigger={
        <button className="availability-dropdown-toggle">
          <ClockIcon className="availability-time-icon" />
        </button>
      }
      className="availability-container"
      minWidth="280px"
      maxWidth="400px"
    >
      {listContent}
    </PopupDropdown>
  );
};

export interface StudioAvailabilityDisplayProps {
  availability: StudioAvailability;
  showFirstLastDay?: boolean;
}

export const StudioAvailabilityDisplay: React.FC<StudioAvailabilityDisplayProps> = ({
  availability,
  showFirstLastDay = false
}) => {
  const { getDisplayByEnglish } = useDays();

  if (!availability || !availability.days.length || !availability.times.length) {
    return <p>Closed</p>;
  }

  const firstDay = getDisplayByEnglish(availability.days[0]);
  const lastDay = getDisplayByEnglish(availability.days[availability.days.length - 1]);

  return (
    <div>
      <div className="studio-availability">
        {showFirstLastDay && <p>{`${firstDay} - ${lastDay}`}</p>}
        <StudioAvailabilityList availability={availability} />
      </div>
    </div>
  );
};

export default StudioAvailabilityDisplay;
