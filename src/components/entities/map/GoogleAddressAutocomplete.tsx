import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface GoogleAddressAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  defaultValue?: string;
}

const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  onPlaceSelected,
  placeholder = 'Enter an address',
  defaultValue = ''
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocompleteInstance;
    autocompleteInstance.setComponentRestrictions({ country: 'il' });
  };

  const handlePlaceChange = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      onPlaceSelected(place);
    }
  };

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChange}>
      <input
        className="form-input"
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </Autocomplete>
  );
};

export default GoogleAddressAutocomplete;
