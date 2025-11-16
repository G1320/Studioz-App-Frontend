import PhoneIcon from '@mui/icons-material/Phone';
import { useDropdown } from '@shared/hooks';

interface PhoneDropdownProps {
  phone: string;
}

const PhoneDropdown: React.FC<PhoneDropdownProps> = ({ phone }) => {
  const { isOpen, toggle, dropdownRef, buttonRef, containerRef } = useDropdown();

  // Type assertions for specific element types
  const divDropdownRef = dropdownRef as React.RefObject<HTMLDivElement>;
  const btnRef = buttonRef as React.RefObject<HTMLButtonElement>;
  const divContainerRef = containerRef as React.RefObject<HTMLDivElement>;

  return (
    <div ref={divContainerRef} className="phone-container">
      <div className="phone-summary">
        <button ref={btnRef} onClick={toggle} className="phone-dropdown-toggle">
          <PhoneIcon />
        </button>
      </div>

      {isOpen && (
        <div ref={divDropdownRef} className="phone-dropdown">
          <div className="phone-details">
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneDropdown;
