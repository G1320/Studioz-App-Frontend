/**
 * Schema exports for validation module
 */

// Base schemas
export * from './base';

// Form schemas
export * from './studioSchema';
export * from './itemSchema';

// Re-export commonly used types
export type {
  StudioFormData,
  StudioEditData,
  StudioStep1Data,
  StudioStep2Data,
  StudioStep3Data,
  StudioStep4Data,
  StudioStep5Data,
  StudioStep6Data
} from './studioSchema';

export type {
  ItemFormData,
  ItemEditData,
  ItemCreateData
} from './itemSchema';

