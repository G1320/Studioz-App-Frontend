import React, { useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

interface AddressAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  defaultValue?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
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
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChange}>
        <input
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
    </LoadScript>
  );
};

export default AddressAutocomplete;
