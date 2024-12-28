import React, { useEffect, useRef, useState } from 'react';
import { StudioAvailability, DayOfWeek } from 'src/types/studio';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AvailabilityDropdownProps {
  availability: StudioAvailability;
}

const AvailabilityDropdown: React.FC<AvailabilityDropdownProps> = ({ availability }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref for the toggle button

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the dropdown and the toggle button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Listen for outside clicks
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup the event listener
    };
  }, []);

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
      <button
        ref={buttonRef} // Attach the ref to the button
        onClick={toggleDropdown}
        className="availability-dropdown-toggle"
      >
        <ExpandMoreIcon />
      </button>
      {isOpen && (
        <ul ref={dropdownRef} className="availability-dropdown">
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
