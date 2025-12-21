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
  en: englishTextSchema.min(3, 'Name must be at least 3 characters').max(20, 'Name must be at most 50 characters'),
  he: hebrewTextSchema.min(3, 'השם חייב להיות לפחות 3 תווים').max(20, 'השם חייב להיות לכל היותר 50 תווים').optional()
});

/**
 * Item description schema
 * Requires English description, Hebrew is optional
 */
export const itemDescriptionSchema = z.object({
  en: z.string().min(1, 'Description is required').max(2000, 'Description must be at most 2000 characters'),
  he: z.string().max(2000, 'תיאור חייב להיות לכל היותר 2000 תווים').optional()
});

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
  availability: z.array(z.any()).optional() // Availability array - can be refined later
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
 * Type inference from schemas
 */
export type ItemFormData = z.infer<typeof itemFullSchema>;
export type ItemEditData = z.infer<typeof itemEditSchema>;
export type ItemCreateData = z.infer<typeof itemCreateSchema>;
