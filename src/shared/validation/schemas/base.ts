import { z } from 'zod';

/**
 * Base schema utilities for common validation patterns
 */

/**
 * Regex patterns for validation
 */
export const REGEX_PATTERNS = {
  /** Hebrew text pattern - allows Hebrew characters, spaces, and common punctuation */
  HEBREW: /^[\u0590-\u05FF\s.,;:!?'"()-]+$/,
  /** English text pattern - allows English letters, numbers, spaces, and common punctuation */
  ENGLISH: /^[a-zA-Z0-9\s.,;:!?'"()-]+$/,
  /** URL pattern */
  URL: /^https?:\/\/.+/,
  /** Phone number pattern (flexible - allows various formats) */
  PHONE: /^[\d\s\-\+\(\)]+$/,
  /** Email pattern */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

/**
 * Hebrew text schema factory with validation
 * Validates that text contains Hebrew characters
 *
 * @param fieldName - Optional field name for field-specific error messages (e.g., 'name', 'title', 'description')
 * @returns Zod schema for Hebrew text
 */
export function hebrewTextSchema(fieldName?: string): z.ZodString {
  const fieldLabel = fieldName ? getFieldLabel(fieldName) : 'text';
  return z
    .string()
    .min(1, `Please enter the ${fieldLabel} in Hebrew`)
    .refine((val) => REGEX_PATTERNS.HEBREW.test(val) || val.length === 0, {
      message: `${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)} must contain Hebrew characters`
    });
}

/**
 * English text schema factory with validation
 * Validates that text contains English characters
 *
 * @param fieldName - Optional field name for field-specific error messages (e.g., 'name', 'title', 'description')
 * @returns Zod schema for English text
 */
export function englishTextSchema(fieldName?: string): z.ZodString {
  const fieldLabel = fieldName ? getFieldLabel(fieldName) : 'text';
  return z
    .string()
    .min(1, `Please enter the ${fieldLabel} in English`)
    .refine((val) => REGEX_PATTERNS.ENGLISH.test(val) || val.length === 0, {
      message: `${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)} must contain English characters`
    });
}

/**
 * Helper function to get user-friendly field labels
 */
function getFieldLabel(fieldName: string): string {
  const fieldLabelMap: Record<string, string> = {
    name: 'name',
    title: 'title',
    subtitle: 'subtitle',
    description: 'description',
    address: 'address',
    city: 'city',
    phone: 'phone number'
  };

  return fieldLabelMap[fieldName.toLowerCase()] || fieldName;
}

/**
 * URL schema with validation
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .refine((val) => REGEX_PATTERNS.URL.test(val), {
    message: 'URL must start with http:// or https://'
  });

/**
 * Phone number schema
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine((val) => REGEX_PATTERNS.PHONE.test(val), {
    message: 'Invalid phone number format'
  });

/**
 * Email schema
 */
export const emailSchema = z.string().min(1, 'Email is required').email('Invalid email format');

/**
 * Translation object schema factory
 * Creates a schema for objects with en and he properties
 *
 * @param schemas - Object with en and he schema definitions
 * @returns Zod schema for translation object
 *
 * @example
 * ```ts
 * const nameSchema = translationSchema({
 *   en: z.string().min(3),
 *   he: z.string().min(3)
 * });
 * ```
 */
export function translationSchema<T extends z.ZodTypeAny>(schemas: {
  en: T;
  he: T;
}): z.ZodObject<{
  en: T;
  he: T;
}> {
  return z.object({
    en: schemas.en,
    he: schemas.he
  });
}

/**
 * Optional translation object schema factory
 * Creates a schema for optional translation objects
 *
 * @param schemas - Object with en and he schema definitions
 * @returns Zod schema for optional translation object
 */
export function optionalTranslationSchema<T extends z.ZodTypeAny>(schemas: {
  en: T;
  he: T;
}): z.ZodOptional<
  z.ZodObject<{
    en: z.ZodOptional<T>;
    he: z.ZodOptional<T>;
  }>
> {
  return z
    .object({
      en: schemas.en.optional(),
      he: schemas.he.optional()
    })
    .optional();
}

/**
 * Positive number schema
 */
export const positiveNumberSchema = z.number().positive('Number must be positive').int('Number must be an integer');

/**
 * Non-negative number schema
 */
export const nonNegativeNumberSchema = z
  .number()
  .nonnegative('Number must be non-negative')
  .int('Number must be an integer');

/**
 * Array of strings schema with minimum length
 */
export function stringArraySchema(minLength: number = 1, message?: string) {
  return z
    .array(z.string())
    .min(minLength, message || `At least ${minLength} item${minLength > 1 ? 's' : ''} is required`);
}

/**
 * Day of week enum schema
 */
export const dayOfWeekSchema = z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

/**
 * Time string schema (HH:MM format)
 */
export const timeSchema = z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format');

/**
 * Studio availability time slot schema
 */
export const timeSlotSchema = z.object({
  start: timeSchema,
  end: timeSchema
});

/**
 * Studio availability schema
 */
export const studioAvailabilitySchema = z
  .object({
    days: z.array(dayOfWeekSchema).min(1, 'Please select at least one day when your studio is open'),
    times: z.array(timeSlotSchema).min(1, 'At least one time slot is required')
  })
  .refine((data) => data.days.length === data.times.length, {
    message: 'Number of days must match number of time slots',
    path: ['times']
  });

/**
 * Parking option enum schema
 */
export const parkingSchema = z.enum(['none', 'free', 'paid']);

/**
 * Price per unit enum schema
 */
export const pricePerSchema = z.enum(['hour', 'session', 'unit', 'song']);
