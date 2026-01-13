/**
 * Field character limits used across forms and validation schemas
 * Single source of truth for all text field constraints
 */

// Studio fields
export const STUDIO_NAME_MIN = 3;
export const STUDIO_NAME_MAX = 50;
export const STUDIO_SUBTITLE_MAX = 100;
export const STUDIO_DESCRIPTION_MAX = 2000;

// Item/Service fields
export const ITEM_NAME_MIN = 3;
export const ITEM_NAME_MAX = 50;
export const ITEM_DESCRIPTION_MAX = 2000;

// Shared/Common limits
export const ADDRESS_MAX = 200;
export const CITY_MAX = 100;
export const MAX_OCCUPANCY_MIN = 1;
export const MAX_OCCUPANCY_MAX = 1000;
export const MAX_GENRES = 12;

// Grouped exports for convenience
export const FIELD_LIMITS = {
  studio: {
    name: { min: STUDIO_NAME_MIN, max: STUDIO_NAME_MAX },
    subtitle: { max: STUDIO_SUBTITLE_MAX },
    description: { max: STUDIO_DESCRIPTION_MAX }
  },
  item: {
    name: { min: ITEM_NAME_MIN, max: ITEM_NAME_MAX },
    description: { max: ITEM_DESCRIPTION_MAX }
  },
  common: {
    address: { max: ADDRESS_MAX },
    city: { max: CITY_MAX },
    maxOccupancy: { min: MAX_OCCUPANCY_MIN, max: MAX_OCCUPANCY_MAX },
    genres: { max: MAX_GENRES }
  }
} as const;
