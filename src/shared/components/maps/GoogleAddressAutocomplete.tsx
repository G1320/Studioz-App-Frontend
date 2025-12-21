import React, { useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface GoogleAddressAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  defaultValue?: string;
  fieldName?: string;
  onInputChange?: (value: string) => void;
}

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  onPlaceSelected,
  placeholder = 'Enter an address',
  defaultValue = '',
  fieldName = 'address',
  onInputChange
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocompleteInstance;
    autocompleteInstance.setComponentRestrictions({ country: 'il' });
  };

  const handlePlaceChange = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      onPlaceSelected(place);
      
      // Update the input value to the formatted address
      if (inputRef.current && place.formatted_address) {
        inputRef.current.value = place.formatted_address;
        // Notify parent of the change
        onInputChange?.(place.formatted_address);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange?.(value);
  };

  // Update input value when defaultValue changes
  useEffect(() => {
    if (inputRef.current && defaultValue && inputRef.current.value !== defaultValue) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChange}>
      <input
        ref={inputRef}
        className="form-input"
        type="text"
        name={fieldName}
        id={fieldName}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={handleInputChange}
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
