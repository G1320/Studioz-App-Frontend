import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDropdown } from '@shared/hooks';

interface AddressDropdownProps {
  address: string;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({ address }) => {
  const { isOpen, toggle, dropdownRef, buttonRef, containerRef } = useDropdown();

  // Type assertions for specific element types
  const divDropdownRef = dropdownRef as React.RefObject<HTMLDivElement>;
  const btnRef = buttonRef as React.RefObject<HTMLButtonElement>;
  const divContainerRef = containerRef as React.RefObject<HTMLDivElement>;

  return (
    <div ref={divContainerRef} className="address-container">
      <div className="address-summary">
        <button ref={btnRef} onClick={toggle} className="address-dropdown-toggle">
          <LocationOnIcon />
        </button>
      </div>

      {isOpen && (
        <div ref={divDropdownRef} className="address-dropdown">
          <div className="address-details">
            <p>{address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressDropdown;
