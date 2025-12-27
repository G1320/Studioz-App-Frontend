import { z } from 'zod';
import {
  translationSchema,
  hebrewTextSchema,
  englishTextSchema,
  urlSchema,
  phoneSchema,
  positiveNumberSchema,
  stringArraySchema,
  studioAvailabilitySchema,
  parkingSchema,
  optionalTranslationSchema
} from './base';

/**
 * Studio name schema
 * Requires both English and Hebrew names, 3-50 characters each
 */
export const studioNameSchema = translationSchema({
  en: englishTextSchema('name')
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name must be at most 20 characters'),
  he: hebrewTextSchema('name').min(3, 'השם חייב להיות לפחות 3 תווים').max(20, 'השם חייב להיות לכל היותר 20 תווים')
});

/**
 * Studio subtitle schema (optional)
 */
export const studioSubtitleSchema = optionalTranslationSchema({
  en: englishTextSchema('subtitle').max(100, 'Subtitle must be at most 100 characters').optional(),
  he: hebrewTextSchema('subtitle').max(100, 'כותרת משנה חייבת להיות לכל היותר 100 תווים').optional()
});

/**
 * Studio description schema (optional)
 */
export const studioDescriptionSchema = optionalTranslationSchema({
  en: englishTextSchema('description').max(2000, 'Description must be at most 2000 characters').optional(),
  he: hebrewTextSchema('description').max(2000, 'תיאור חייב להיות לכל היותר 2000 תווים').optional()
});

/**
 * Step 1: Basic Information Schema
 * Validates: name, subtitle, description
 */
export const studioStep1Schema = z.object({
  name: studioNameSchema,
  subtitle: studioSubtitleSchema.optional(),
  description: studioDescriptionSchema.optional()
});

/**
 * Step 2: Categories & Genres Schema
 * Validates: categories, subCategories, genres
 */
export const studioStep2Schema = z.object({
  categories: stringArraySchema(1, 'At least one category is required'),
  subCategories: stringArraySchema(1, 'At least one subcategory is required'),
  genres: stringArraySchema(1, 'At least one genre is required')
});

/**
 * Step 3: Availability Schema
 * Validates: studioAvailability
 */
export const studioStep3Schema = z.object({
  studioAvailability: studioAvailabilitySchema.optional()
});

/**
 * Social media links schema
 * Only validates if there is text, otherwise ignores the field completely
 */
export const socialsSchema = z.object({
  instagram: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? undefined : val),
    urlSchema.optional()
  ),
  facebook: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? undefined : val),
    urlSchema.optional()
  )
}).optional();

/**
 * Step 4: Location & Contact Schema
 * Validates: address, phone, website, socials
 */
export const studioStep4Schema = z.object({
  address: z.preprocess(
    (val) => (val === undefined || val === null ? '' : val),
    z.string().min(1, 'Address is required').max(200, 'Address must be at most 200 characters')
  ),
  phone: phoneSchema,
  website: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? undefined : val),
    urlSchema.optional()
  ),
  socials: socialsSchema
});

/**
 * Step 5: Files & Media Schema
 * Validates: coverImage, galleryImages
 * Note: This step has custom content (FileUploader), but we still validate the data
 */
export const studioStep5Schema = z.object({
  coverImage: z.preprocess((val) => {
    // Convert undefined/null/empty string to undefined (so it becomes optional)
    if (val === undefined || val === null || val === '') {
      return undefined;
    }
    return val;
  }, urlSchema.optional()),
  galleryImages: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(urlSchema).min(1, 'At least one image is required')
  ),
  coverAudioFile: urlSchema.optional(),
  galleryAudioFiles: z.array(urlSchema).optional()
});

/**
 * Step 6: Details Schema
 * Validates: maxOccupancy, isSmokingAllowed, isWheelchairAccessible, parking
 */
export const studioStep6Schema = z.object({
  maxOccupancy: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') {
        return undefined;
      }
      // Convert string to number
      if (typeof val === 'string') {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    positiveNumberSchema
      .min(1, 'Max occupancy is required and must be at least 1')
      .max(1000, 'Max occupancy must be at most 1000')
  ),
  isSmokingAllowed: z.preprocess((val) => {
    // Convert string to boolean, handle various formats
    if (val === undefined || val === null || val === '') {
      return false;
    }
    // Already a boolean, return as-is
    if (typeof val === 'boolean') {
      return val;
    }
    // Convert string to boolean
    if (typeof val === 'string') {
      // Handle "true"/"false" strings, "1"/"0", "on"/"off"
      const lowerVal = val.toLowerCase();
      return lowerVal === 'true' || lowerVal === '1' || lowerVal === 'on';
    }
    return Boolean(val);
  }, z.boolean().default(false)),
  isWheelchairAccessible: z.preprocess((val) => {
    // Convert string to boolean, handle various formats
    if (val === undefined || val === null || val === '') {
      return false;
    }
    // Already a boolean, return as-is
    if (typeof val === 'boolean') {
      return val;
    }
    // Convert string to boolean
    if (typeof val === 'string') {
      // Handle "true"/"false" strings, "1"/"0", "on"/"off"
      const lowerVal = val.toLowerCase();
      return lowerVal === 'true' || lowerVal === '1' || lowerVal === 'on';
    }
    return Boolean(val);
  }, z.boolean().optional()),
  parking: parkingSchema.optional()
});

/**
 * Full Studio Schema
 * Validates all fields for complete studio submission
 */
export const studioFullSchema = z.object({
  // Basic Information
  name: studioNameSchema,
  subtitle: studioSubtitleSchema.optional(),
  description: studioDescriptionSchema.optional(),

  // Categories & Genres
  categories: stringArraySchema(1, 'At least one category is required'),
  subCategories: stringArraySchema(1, 'At least one subcategory is required'),
  genres: stringArraySchema(1, 'At least one genre is required'),

  // Availability
  studioAvailability: studioAvailabilitySchema.optional(),

  // Location & Contact
  address: z.preprocess(
    (val) => (val === undefined || val === null ? '' : val),
    z.string().min(1, 'Address is required').max(200, 'Address must be at most 200 characters')
  ),
  phone: phoneSchema,
  website: z.preprocess(
    (val) => (val === undefined || val === null || val === '' ? undefined : val),
    urlSchema.optional()
  ),
  socials: socialsSchema,
  city: z.string().min(1, 'City is required').max(100, 'City must be at most 100 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),

  // Files & Media
  coverImage: urlSchema,
  galleryImages: z.array(urlSchema).min(1, 'At least one gallery image is required'),
  coverAudioFile: urlSchema.optional(),
  galleryAudioFiles: z.array(urlSchema).optional(),

  // Details
  maxOccupancy: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') {
        return undefined;
      }
      // Convert string to number
      if (typeof val === 'string') {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    positiveNumberSchema
      .min(1, 'Max occupancy must be at least 1')
      .max(1000, 'Max occupancy must be at most 1000')
  ),
  isSmokingAllowed: z.boolean().default(false),
  isWheelchairAccessible: z.boolean().optional(),
  parking: parkingSchema.optional(),

  // Optional fields
  isSelfService: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  totalBookings: z.number().int().min(0).optional()
});

/**
 * Studio Edit Schema
 * Similar to full schema but with more optional fields for partial updates
 * Allows dual-language names (English text in Hebrew field and vice versa)
 */
export const studioEditSchema = studioFullSchema.partial().extend({
  // Allow dual-language names - remove Hebrew/English character restrictions for edit
  name: z
    .object({
      en: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(20, 'Name must be at most 20 characters')
        .optional(),
      he: z
        .string()
        .min(3, 'השם חייב להיות לפחות 3 תווים')
        .max(20, 'השם חייב להיות לכל היותר 20 תווים')
        .optional()
    })
    .optional(),
  categories: stringArraySchema(1).optional(),
  subCategories: stringArraySchema(1).optional(),
  maxOccupancy: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') {
        return undefined;
      }
      // Convert string to number
      if (typeof val === 'string') {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    positiveNumberSchema
      .min(1, 'Max occupancy must be at least 1')
      .max(1000, 'Max occupancy must be at most 1000')
      .optional()
  )
});

/**
 * Type inference from schemas
 */
export type StudioStep1Data = z.infer<typeof studioStep1Schema>;
export type StudioStep2Data = z.infer<typeof studioStep2Schema>;
export type StudioStep3Data = z.infer<typeof studioStep3Schema>;
export type StudioStep4Data = z.infer<typeof studioStep4Schema>;
export type StudioStep5Data = z.infer<typeof studioStep5Schema>;
export type StudioStep6Data = z.infer<typeof studioStep6Schema>;
export type StudioFormData = z.infer<typeof studioFullSchema>;
export type StudioEditData = z.infer<typeof studioEditSchema>;

/**
 * Step 1 Schema for Edit (allows dual-language names)
 * Allows English text in Hebrew field and vice versa
 */
export const studioStep1EditSchema = z.object({
  name: z.object({
    en: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(20, 'Name must be at most 20 characters')
      .optional(),
    he: z
      .string()
      .min(3, 'השם חייב להיות לפחות 3 תווים')
      .max(20, 'השם חייב להיות לכל היותר 20 תווים')
      .optional()
  }),
  subtitle: studioSubtitleSchema.optional(),
  description: studioDescriptionSchema.optional()
});

/**
 * Step schema map for easy access
 */
export const studioStepSchemas = {
  'basic-info': studioStep1Schema,
  categories: studioStep2Schema,
  availability: studioStep3Schema,
  location: studioStep4Schema,
  files: studioStep5Schema,
  details: studioStep6Schema
} as const;

/**
 * Step schema map for edit (with flexible name validation)
 */
export const studioStepSchemasEdit = {
  'basic-info': studioStep1EditSchema,
  categories: studioStep2Schema,
  availability: studioStep3Schema,
  location: studioStep4Schema,
  files: studioStep5Schema,
  details: studioStep6Schema
} as const;
