import { useEffect, useRef, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
interface AddressDropdownProps {
  address: string;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({ address }) => {
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
    <div className="address-container">
      <div className="address-summary">
        <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="address-dropdown-toggle">
          <LocationOnIcon />
        </button>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="address-dropdown">
          <div className="address-details">
            <p>{address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressDropdown;
