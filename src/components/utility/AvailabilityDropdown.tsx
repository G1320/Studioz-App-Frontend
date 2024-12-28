import React, { useState } from 'react';
import { StudioAvailability, DayOfWeek } from 'src/types/studio';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AvailabilityDropdownProps {
  availability: StudioAvailability;
}

const AvailabilityDropdown: React.FC<AvailabilityDropdownProps> = ({ availability }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const formatAvailability = (days: DayOfWeek[], times: { start: string; end: string }[]) => {
    const allDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return allDays.map((day) => {
      const index = days.indexOf(day);
      if (index === -1) {
        // If day does not exist in availability, return as "Closed"
        return { day, hours: 'Closed' };
      }
      // Otherwise, return the available time for that day
      return { day, hours: `${times[index]?.start} - ${times[index]?.end}` };
    });
  };

  const formattedAvailability = formatAvailability(availability?.days, availability?.times);

  return (
    <div className="availability-container">
      <button onClick={toggleDropdown} className="availability-dropdown-toggle">
        <ExpandMoreIcon />
      </button>
      {isOpen && (
        <ul className="availability-dropdown">
          {formattedAvailability.map(({ day, hours }, index) => (
            <li key={index}>
              <strong>{day}:</strong> <p>{hours}</p>
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
  if (!availability || !availability.days.length || !availability.times.length) {
    return <p>Closed</p>;
  }

  const firstDay = availability.days[0];
  const lastDay = availability.days[availability.days.length - 1];

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
