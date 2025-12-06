import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PopupDropdown } from '@shared/components/drop-downs';

interface AddressDropdownProps {
  address: string;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({ address }) => {
  return (
    <PopupDropdown
      trigger={
        <button className="address-dropdown-toggle">
          <LocationOnIcon />
        </button>
      }
      className="address-container"
      minWidth="240px"
      maxWidth="400px"
    >
      <div className="address-details">
        <p>{address}</p>
      </div>
    </PopupDropdown>
  );
};

export default AddressDropdown;
