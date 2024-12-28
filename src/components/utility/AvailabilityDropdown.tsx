import React, { useEffect, useRef, useState } from 'react';
import { StudioAvailability, DayOfWeek } from 'src/types/studio';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDays } from '@hooks/index';

interface AvailabilityDropdownProps {
  availability: StudioAvailability;
}

const AvailabilityDropdown: React.FC<AvailabilityDropdownProps> = ({ availability }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { getDisplayByEnglish } = useDays();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatAvailability = (days: DayOfWeek[], times: { start: string; end: string }[]) => {
    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return allDays.map((day) => {
      const index = days.indexOf(day);
      if (index === -1) {
        // If day does not exist in availability, return as "Closed"
        return { day, displayDay: getDisplayByEnglish(day), hours: 'Closed' };
      }
      // Otherwise, return the available time for that day
      return {
        day,
        displayDay: getDisplayByEnglish(day),
        hours: `${times[index]?.start} - ${times[index]?.end}`
      };
    });
  };

  const formattedAvailability = formatAvailability(availability?.days, availability?.times);

  return (
    <div className="availability-container">
      <button ref={buttonRef} onClick={toggleDropdown} className="availability-dropdown-toggle">
        <ExpandMoreIcon />
      </button>
      {isOpen && (
        <ul ref={dropdownRef} className="availability-dropdown">
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
  const { getDisplayByEnglish } = useDays();

  if (!availability || !availability.days.length || !availability.times.length) {
    return <p>Closed</p>;
  }

  const firstDay = getDisplayByEnglish(availability.days[0]);
  const lastDay = getDisplayByEnglish(availability.days[availability.days.length - 1]);

  return (
    <div>
      <div className="studio-availability">
        <p>{`${firstDay} - ${lastDay}`}</p>
        <AvailabilityDropdown availability={availability} />
      </div>
    </div>
  );
};

export default StudioAvailabilityDisplay;
