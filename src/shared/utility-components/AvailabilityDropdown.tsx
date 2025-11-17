import React from 'react';
import { StudioAvailability, DayOfWeek } from 'src/types/studio';
import { useDays, useDropdown } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface AvailabilityDropdownProps {
  availability: StudioAvailability;
}

const AvailabilityDropdown: React.FC<AvailabilityDropdownProps> = ({ availability }) => {
  const { i18n } = useTranslation();
  const { getDisplayByEnglish } = useDays();
  const { isOpen, toggle, dropdownRef, buttonRef, containerRef } = useDropdown();

  // Type assertions for specific element types
  const ulRef = dropdownRef as React.RefObject<HTMLUListElement>;
  const btnRef = buttonRef as React.RefObject<HTMLButtonElement>;
  const divRef = containerRef as React.RefObject<HTMLDivElement>;

  const formatAvailability = (days: DayOfWeek[], times: { start: string; end: string }[]) => {
    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return allDays.map((day) => {
      const index = days.indexOf(day);
      if (index === -1) {
        // If day does not exist in availability, return as "Closed"
        return { day, displayDay: getDisplayByEnglish(day), hours: i18n.language === 'he' ? 'סגור' : 'Closed' };
      }
      // Reverse start and end for Hebrew
      const hours =
        i18n.language === 'he'
          ? `${times[index]?.end} - ${times[index]?.start}`
          : `${times[index]?.start} - ${times[index]?.end}`;
      return {
        day,
        displayDay: getDisplayByEnglish(day),
        hours
      };
    });
  };

  const formattedAvailability = formatAvailability(availability?.days, availability?.times);

  return (
    <div ref={divRef} className="availability-container">
      <button ref={btnRef} onClick={toggle} className="availability-dropdown-toggle">
        <AccessTimeIcon className="availability-time-icon" />
      </button>
      {isOpen && (
        <ul ref={ulRef} className="availability-dropdown">
          {formattedAvailability.map(({ displayDay, hours }, index) => (
            <li key={index}>
              <strong>{displayDay}:</strong> <p>{hours}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface StudioAvailabilityProps {
  availability: StudioAvailability;
}

const StudioAvailabilityDisplay: React.FC<StudioAvailabilityProps> = ({ availability }) => {
  // const { getDisplayByEnglish } = useDays();

  if (!availability || !availability.days.length || !availability.times.length) {
    return <p>Closed</p>;
  }

  // const firstDay = getDisplayByEnglish(availability.days[0]);
  // const lastDay = getDisplayByEnglish(availability.days[availability.days.length - 1]);

  return (
    <div>
      <div className="studio-availability">
        {/* <p>{`${firstDay} - ${lastDay}`}</p> */}
        <AvailabilityDropdown availability={availability} />
      </div>
    </div>
  );
};

export default StudioAvailabilityDisplay;
