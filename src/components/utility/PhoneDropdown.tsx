import { useEffect, useRef, useState } from 'react';
import PhoneIcon from '@mui/icons-material/Phone';

interface PhoneDropdownProps {
  phone: string;
}

const PhoneDropdown: React.FC<PhoneDropdownProps> = ({ phone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="phone-container">
      <div className="phone-summary">
        <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="phone-dropdown-toggle">
          <PhoneIcon />
        </button>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="phone-dropdown">
          <div className="phone-details">
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneDropdown;
