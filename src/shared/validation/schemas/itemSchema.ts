import { z } from 'zod';
import {
  hebrewTextSchema,
  englishTextSchema,
  urlSchema,
  positiveNumberSchema,
  stringArraySchema,
  pricePerSchema,
  optionalTranslationSchema
} from './base';

/**
 * Item name schema
 * Requires English name, Hebrew is optional
 */
export const itemNameSchema = z.object({
  en: englishTextSchema('name')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  he: hebrewTextSchema('name')
    .min(3, 'השם חייב להיות לפחות 3 תווים')
    .max(50, 'השם חייב להיות לכל היותר 50 תווים')
    .optional()
});

/**
 * Item description schema
 * Requires English description, Hebrew is optional
 */
export const itemDescriptionSchema = z.object({
  en: englishTextSchema('description')
    .min(1, 'Please enter a description in English')
    .max(2000, 'Description must be at most 2000 characters'),
  he: hebrewTextSchema('description').max(2000, 'תיאור חייב להיות לכל היותר 2000 תווים').optional()
});

/**
 * Duration schema (for booking duration, preparation time, etc.)
 */
export const durationSchema = z.object({
  value: positiveNumberSchema.min(1, 'Value must be at least 1'),
  unit: z.enum(['minutes', 'hours', 'days'], {
    message: 'Unit must be minutes, hours, or days'
  })
}).optional();

/**
 * Advance booking required schema
 */
export const advanceBookingRequiredSchema = z.object({
  value: positiveNumberSchema.min(1, 'Value must be at least 1'),
  unit: z.enum(['minutes', 'hours', 'days'], {
    message: 'Unit must be minutes, hours, or days'
  })
}).optional();

/**
 * Block discounts schema (8-hour and 12-hour day rates)
 */
export const blockDiscountsSchema = z.object({
  eightHour: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive('8-hour price must be positive').optional()
  ),
  twelveHour: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive('12-hour price must be positive').optional()
  )
}).optional();

/**
 * Full Item Schema
 * Validates all fields for complete item submission
 */
export const itemFullSchema = z.object({
  // Basic Information
  name: itemNameSchema,
  description: itemDescriptionSchema,

  // Categories & Genres
  categories: stringArraySchema(1, 'At least one category is required'),
  subCategories: stringArraySchema(1, 'At least one subcategory is required'),
  genres: z.array(z.string()).optional(),

  // Pricing
  price: positiveNumberSchema
    .min(0.01, 'Price must be at least 0.01')
    .max(9999, 'Price must be at most 999,999')
    .optional(),
  pricePer: pricePerSchema.optional(),
  blockDiscounts: blockDiscountsSchema,

  // Media
  imageUrl: urlSchema.optional(),

  // Location (optional - may inherit from studio)
  address: z.string().max(200, 'Address must be at most 200 characters').optional(),
  city: z.string().max(100, 'City must be at most 100 characters').optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),

  // Options
  instantBook: z.boolean().optional(),

  // References
  studioId: z.string().min(1, 'Studio ID is required'),
  studioName: optionalTranslationSchema({
    en: z.string().optional(),
    he: z.string().optional()
  }).optional(),

  // Stock
  inStock: z.boolean().default(true),

  // Optional fields
  addOnIds: z.array(z.string()).optional(),
  availability: z.array(z.any()).optional(), // Availability array - can be refined later
  
  // Booking Requirements
  minimumBookingDuration: durationSchema,
  minimumQuantity: positiveNumberSchema.min(1, 'Minimum quantity must be at least 1').optional(),
  advanceBookingRequired: advanceBookingRequiredSchema,
  
  // Setup & Preparation
  preparationTime: durationSchema,
  
  // Remote Service
  remoteService: z.boolean().optional(),
  remoteAccessMethod: z.enum(['zoom', 'teams', 'skype', 'custom', 'other']).optional(),
  softwareRequirements: z.array(z.string()).optional(),
  
  // Quantity Management
  maxQuantityPerBooking: positiveNumberSchema.min(1, 'Max quantity per booking must be at least 1').optional()
});

/**
 * Item Edit Schema
 * Similar to full schema but with more optional fields for partial updates
 */
export const itemEditSchema = itemFullSchema.partial().extend({
  name: itemNameSchema.optional(),
  description: itemDescriptionSchema.optional(),
  categories: stringArraySchema(1).optional(),
  subCategories: stringArraySchema(1).optional()
});

/**
 * Item Create Schema (for form submission)
 * This is the schema used when creating a new item via the form
 * Some fields are optional or have different requirements
 */
export const itemCreateSchema = z.object({
  // Basic Information
  name: itemNameSchema,
  description: itemDescriptionSchema,

  // Categories & Genres
  categories: stringArraySchema(1, 'At least one category is required'),
  subCategories: stringArraySchema(1, 'At least one subcategory is required'),
  genres: z.array(z.string()).optional(),

  // Pricing
  price: z.number().min(0.01, 'Price must be at least 0.01').max(999999, 'Price must be at most 999,999').optional(),
  pricePer: pricePerSchema.optional(),
  blockDiscounts: blockDiscountsSchema,

  // Options
  instantBook: z.boolean().optional(),

  // References (from URL params or context)
  studioId: z.string().min(1, 'Studio ID is required').optional(),
  studioName: optionalTranslationSchema({
    en: z.string().optional(),
    he: z.string().optional()
  }).optional()
});

/**
 * Step 1: Basic Information Schema
 * Validates: name, description
 */
export const itemStep1Schema = z.object({
  name: itemNameSchema,
  description: itemDescriptionSchema
});

/**
 * Step 2: Categories Schema
 * Validates: categories, subCategories
 */
export const itemStep2Schema = z.object({
  categories: stringArraySchema(1, 'At least one category is required'),
  subCategories: stringArraySchema(1, 'At least one subcategory is required')
});

/**
 * Step 3: Pricing & Options Schema
 * Validates: price, pricePer, blockDiscounts, instantBook
 */
export const itemStep3Schema = z.object({
  price: z
    .preprocess(
      (val) => {
        if (val === undefined || val === null || val === '') {
          return undefined;
        }
        if (typeof val === 'string') {
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        }
        return val;
      },
      z
        .number()
        .min(0.01, 'Price must be at least 0.01')
        .max(999999, 'Price must be at most 999,999')
        .optional()
    ),
  pricePer: pricePerSchema.optional(),
  minimumBookingDuration: z.object({
    value: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().positive().optional()
    ),
    unit: z.enum(['minutes', 'hours', 'days']).optional()
  }).optional(),
  blockDiscounts: z.object({
    eightHour: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().positive().optional()
    ),
    twelveHour: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().positive().optional()
    )
  }).optional(),
  instantBook: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') {
        return false;
      }
      if (typeof val === 'boolean') {
        return val;
      }
      if (typeof val === 'string') {
        return val === 'true' || val === '1' || val === 'on';
      }
      return Boolean(val);
    },
    z.boolean().optional()
  )
});

/**
 * Step 1 Schema for Edit (allows dual-language names and descriptions)
 * Allows English text in Hebrew field and vice versa
 */
export const itemStep1EditSchema = z.object({
  name: z.object({
    en: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be at most 50 characters')
      .optional(),
    he: z
      .string()
      .min(3, 'השם חייב להיות לפחות 3 תווים')
      .max(50, 'השם חייב להיות לכל היותר 50 תווים')
      .optional()
  }),
  description: z
    .object({
      en: z.string().max(2000, 'Description must be at most 2000 characters').optional(),
      he: z.string().max(2000, 'תיאור חייב להיות לכל היותר 2000 תווים').optional()
    })
    .optional()
});

/**
 * Step 4: Booking Settings Schema
 * Validates: minimumBookingDuration, minimumQuantity,
 * advanceBookingRequired, preparationTime
 */
export const itemStep4Schema = z.object({
  minimumBookingDuration: z.object({
    value: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().positive().optional()
    ),
    unit: z.enum(['minutes', 'hours', 'days']).optional()
  }).optional(),
  minimumQuantity: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  advanceBookingRequired: z.object({
    value: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().positive().optional()
    ),
    unit: z.enum(['minutes', 'hours', 'days']).optional()
  }).optional(),
  preparationTime: z.object({
    value: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().positive().optional()
    ),
    unit: z.enum(['minutes', 'hours', 'days']).optional()
  }).optional()
}).passthrough();

/**
 * Step 5: Add-ons Schema (optional - no validation required, always passes)
 */
export const itemStep5Schema = z.object({}).passthrough();

/**
 * Step schema map for easy access
 */
export const itemStepSchemas = {
  'basic-info': itemStep1Schema,
  categories: itemStep2Schema,
  pricing: itemStep3Schema,
  'booking-settings': itemStep4Schema,
  'add-ons': itemStep5Schema
} as const;

/**
 * Step schema map for edit (with flexible name and description validation)
 */
export const itemStepSchemasEdit = {
  'basic-info': itemStep1EditSchema,
  categories: itemStep2Schema,
  pricing: itemStep3Schema,
  'booking-settings': itemStep4Schema,
  'add-ons': itemStep5Schema
} as const;

/**
 * Type inference from schemas
 */
export type ItemFormData = z.infer<typeof itemFullSchema>;
export type ItemEditData = z.infer<typeof itemEditSchema>;
export type ItemCreateData = z.infer<typeof itemCreateSchema>;
export type ItemStep1Data = z.infer<typeof itemStep1Schema>;
export type ItemStep2Data = z.infer<typeof itemStep2Schema>;
export type ItemStep3Data = z.infer<typeof itemStep3Schema>;
export type ItemStep4Data = z.infer<typeof itemStep4Schema>;
export type ItemStep1EditData = z.infer<typeof itemStep1EditSchema>;
