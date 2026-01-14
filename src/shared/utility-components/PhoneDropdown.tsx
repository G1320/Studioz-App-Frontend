import { PhoneIcon } from '@shared/components/icons';
import { PopupDropdown } from '@shared/components/drop-downs';

interface PhoneDropdownProps {
  phone: string;
}

const PhoneDropdown: React.FC<PhoneDropdownProps> = ({ phone }) => {
  return (
    <PopupDropdown
      trigger={
        <button className="phone-dropdown-toggle">
          <PhoneIcon />
        </button>
      }
      className="phone-container"
      minWidth="240px"
      maxWidth="400px"
    >
      <div className="phone-details">
        <a href={`tel:${phone}`}>{phone}</a>
      </div>
    </PopupDropdown>
  );
};

export default PhoneDropdown;
