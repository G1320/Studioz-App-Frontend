// Only export lazy components to keep Mapbox out of main bundle (~400KB savings)
export * from './lazyMapComponents';

// Lazy load GoogleAddressAutocomplete to defer Google Maps library loading
import { lazy } from 'react';
export const LazyGoogleAddressAutocomplete = lazy(() =>
  import('./GoogleAddressAutocomplete').then((module) => ({
    default: module.GoogleAddressAutocomplete
  }))
);
