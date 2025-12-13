import React, { useMemo } from 'react';
import { StudioAvailability, DayOfWeek } from 'src/types/studio';
import { useDays } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PopupDropdown } from '@shared/components/drop-downs';
import { GenericList } from '@shared/components';

interface AvailabilityDropdownProps {
  availability: StudioAvailability;
  variant?: 'popup' | 'list';
}

const AvailabilityDropdown: React.FC<AvailabilityDropdownProps> = ({ availability, variant = 'popup' }) => {
  const { i18n } = useTranslation();
  const { getDisplayByEnglish } = useDays();

  const formattedAvailability = useMemo(() => {
    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return allDays.map((day) => {
      const index = availability?.days?.indexOf(day) ?? -1;
      if (index === -1) {
        return { day, displayDay: getDisplayByEnglish(day), hours: i18n.language === 'he' ? 'סגור' : 'Closed' };
      }
      const hours =
        i18n.language === 'he'
          ? `${availability.times[index]?.end} - ${availability.times[index]?.start}`
          : `${availability.times[index]?.start} - ${availability.times[index]?.end}`;
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
          <AccessTimeIcon className="availability-time-icon" />
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

interface StudioAvailabilityProps {
  availability: StudioAvailability;
  showFirstLastDay?: boolean;
}

const StudioAvailabilityDisplay: React.FC<StudioAvailabilityProps> = ({ availability, showFirstLastDay = false }) => {
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
        <AvailabilityDropdown availability={availability} />
      </div>
    </div>
  );
};

export default StudioAvailabilityDisplay;
