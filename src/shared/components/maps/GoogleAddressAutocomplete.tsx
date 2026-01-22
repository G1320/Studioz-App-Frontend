import React, { useRef, useEffect } from 'react';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const LIBRARIES: ('places')[] = ['places'];

interface EnglishAddressData {
  address: string;
  city: string;
}

interface GoogleAddressAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult, englishData?: EnglishAddressData) => void;
  placeholder?: string;
  defaultValue?: string;
  fieldName?: string;
  onInputChange?: (value: string) => void;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

/**
 * Fetches the English version of an address using the Geocoder API
 * This ensures we always store addresses in English regardless of the user's language settings
 */
const getEnglishAddress = async (
  lat: number,
  lng: number
): Promise<EnglishAddressData | null> => {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: { lat, lng },
        language: 'en'
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const cityComponent = result.address_components?.find((component) =>
            component.types.includes('locality')
          );
          resolve({
            address: result.formatted_address || '',
            city: cityComponent?.long_name || ''
          });
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  onPlaceSelected,
  placeholder = 'Enter an address',
  defaultValue = '',
  fieldName = 'address',
  onInputChange,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocompleteInstance;
    autocompleteInstance.setComponentRestrictions({ country: 'il' });
  };

  const handlePlaceChange = async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      // Get English address using geocoding if we have coordinates
      let englishData: EnglishAddressData | undefined;
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const result = await getEnglishAddress(lat, lng);
        if (result) {
          englishData = result;
        }
      }
      
      // Pass both the original place and English data to parent
      // Parent should use englishData.address for storage
      onPlaceSelected(place, englishData);
      
      // Update the input value with the display address (user's language)
      // The stored value will be the English version from englishData
      if (inputRef.current && place.formatted_address) {
        inputRef.current.value = place.formatted_address;
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

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <input
        className="form-input"
        type="text"
        name={fieldName}
        id={fieldName}
        placeholder="Google Maps API key not configured"
        disabled
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
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
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
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
