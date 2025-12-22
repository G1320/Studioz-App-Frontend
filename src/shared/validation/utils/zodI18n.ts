import { ZodIssue } from 'zod';
import { useTranslation } from 'react-i18next';
import { FieldError } from '../types';

/**
 * Default i18n key mapping for Zod error codes
 * Maps Zod error codes to translation keys in forms.json
 */
export const ZOD_ERROR_I18N_MAP: Record<string, string> = {
  invalid_type: 'validation.errors.invalidType',
  invalid_literal: 'validation.errors.invalidLiteral',
  unrecognized_keys: 'validation.errors.unrecognizedKeys',
  invalid_union: 'validation.errors.invalidUnion',
  invalid_union_discriminator: 'validation.errors.invalidUnionDiscriminator',
  invalid_enum_value: 'validation.errors.invalidEnumValue',
  invalid_arguments: 'validation.errors.invalidArguments',
  invalid_return_type: 'validation.errors.invalidReturnType',
  invalid_date: 'validation.errors.invalidDate',
  custom: 'validation.errors.custom',
  invalid_string: 'validation.errors.invalidString',
  too_small: 'validation.errors.tooSmall',
  too_big: 'validation.errors.tooBig',
  invalid_intersection_types: 'validation.errors.invalidIntersectionTypes',
  not_multiple_of: 'validation.errors.notMultipleOf',
  not_finite: 'validation.errors.notFinite'
};

/**
 * Gets the i18n translation key for a Zod error code
 * 
 * @param code - The Zod error code
 * @returns The i18n translation key
 */
export function getI18nKeyForZodCode(code: string): string {
  return ZOD_ERROR_I18N_MAP[code] || 'validation.errors.generic';
}

/**
 * Formats a Zod issue with i18n translation
 * 
 * @param issue - The ZodIssue instance
 * @param t - Translation function from react-i18next
 * @param fieldName - Optional field name for field-specific messages
 * @returns Translated error message
 */
export function formatZodIssueWithI18n(
  issue: ZodIssue,
  t: (key: string, options?: any) => string,
  fieldName?: string
): string {
  // Try field-specific error message first (e.g., validation.fields.name.he.invalidType)
  if (fieldName) {
    const fieldSpecificKey = `validation.fields.${fieldName}.${issue.code}`;
    const fieldSpecificMessage = t(fieldSpecificKey, { defaultValue: '' });
    if (fieldSpecificMessage && fieldSpecificMessage !== fieldSpecificKey) {
      return interpolateMessage(fieldSpecificMessage, issue);
    }
  }

  // Try generic field error (e.g., validation.fields.name.he.error)
  if (fieldName) {
    const genericFieldKey = `validation.fields.${fieldName}.error`;
    const genericFieldMessage = t(genericFieldKey, { defaultValue: '' });
    if (genericFieldMessage && genericFieldMessage !== genericFieldKey) {
      return interpolateMessage(genericFieldMessage, issue);
    }
  }

  // Handle invalid_enum_value errors for days field with a nicer message
  if (issue.code === 'invalid_enum_value' && fieldName) {
    // Handle days field specifically
    if (fieldName === 'studioAvailability.days' || fieldName === 'days' || fieldName.includes('days')) {
      return 'Please select at least one day when your studio is open';
    }
  }

  // For invalid_type errors on translation fields, provide a nicer default message
  if (issue.code === 'invalid_type' && fieldName) {
    // Check if it's a translation field (e.g., name.en, name.he)
    const parts = fieldName.split('.');
    if (parts.length === 2) {
      const [field, lang] = parts;
      if (lang === 'en' || lang === 'he') {
        const langName = lang === 'en' ? 'English' : 'Hebrew (עברית)';
        return `Please enter the ${field} in ${langName}`;
      }
    }
    
    // Handle common required fields with nicer messages
    if (fieldName === 'address') {
      return 'Address is required';
    }
    if (fieldName === 'phone') {
      return 'Phone number is required';
    }
    if (fieldName === 'coverImage') {
      return 'Cover image is required';
    }
    if (fieldName === 'galleryImages') {
      return 'At least one gallery image is required';
    }
    if (fieldName === 'maxOccupancy') {
      if (issue.code === 'invalid_type') {
        const invalidTypeIssue = issue as { received?: string };
        if (invalidTypeIssue.received === 'string') {
          return 'Max occupancy must be a number';
        }
      }
      return 'Max occupancy is required';
    }
    if (fieldName === 'isSmokingAllowed' || fieldName === 'isWheelchairAccessible') {
      if (issue.code === 'invalid_type') {
        const invalidTypeIssue = issue as { received?: string };
        if (invalidTypeIssue.received === 'string') {
          return 'This field must be a valid selection';
        }
      }
      return 'This field is required';
    }
  }

  // Use Zod error code mapping
  const i18nKey = getI18nKeyForZodCode(issue.code);
  const baseMessage = t(i18nKey, { defaultValue: issue.message });

  return interpolateMessage(baseMessage, issue);
}

/**
 * Interpolates variables in error messages
 * Replaces placeholders like {{minimum}} with actual values from the issue
 * 
 * @param message - The message template
 * @param issue - The ZodIssue with validation details
 * @returns Interpolated message
 */
function interpolateMessage(message: string, issue: ZodIssue): string {
  let interpolated = message;

  // Replace common Zod error parameters
  if (issue.code === 'too_small') {
    const tooSmallIssue = issue as { minimum?: number; exact?: number };
    if (typeof tooSmallIssue.minimum === 'number') {
      interpolated = interpolated.replace(/\{\{minimum\}\}/g, String(tooSmallIssue.minimum));
    }
    if (typeof tooSmallIssue.exact === 'number') {
      interpolated = interpolated.replace(/\{\{exact\}\}/g, String(tooSmallIssue.exact));
    }
  }
  if (issue.code === 'too_big') {
    const tooBigIssue = issue as { maximum?: number; exact?: number };
    if (typeof tooBigIssue.maximum === 'number') {
      interpolated = interpolated.replace(/\{\{maximum\}\}/g, String(tooBigIssue.maximum));
    }
    if (typeof tooBigIssue.exact === 'number') {
      interpolated = interpolated.replace(/\{\{exact\}\}/g, String(tooBigIssue.exact));
    }
  }

  // Note: 'invalid_string' is not a valid Zod error code, removed this check

  // Replace path information
  if (issue.path.length > 0) {
    const pathStr = issue.path.join('.');
    interpolated = interpolated.replace(/\{\{path\}\}/g, pathStr);
  }

  return interpolated;
}

/**
 * Hook to format Zod errors with i18n translations
 * 
 * @returns Function to format Zod issues with translations
 * 
 * @example
 * ```tsx
 * const { formatError } = useZodI18n();
 * const errorMessage = formatError(zodIssue, 'name.en');
 * ```
 */
export function useZodI18n() {
  const { t } = useTranslation('forms');

  const formatError = (issue: ZodIssue, fieldName?: string): string => {
    return formatZodIssueWithI18n(issue, t, fieldName);
  };

  return { formatError, t };
}

/**
 * Formats a FieldError with i18n translation
 * 
 * @param fieldError - The FieldError to format
 * @param t - Translation function
 * @returns Translated error message
 */
export function formatFieldErrorWithI18n(
  fieldError: FieldError,
  t: (key: string, options?: any) => string
): string {
  // Try to get field-specific error
  const fieldSpecificKey = `validation.fields.${fieldError.path}.error`;
  const fieldSpecificMessage = t(fieldSpecificKey, { defaultValue: '' });
  
  if (fieldSpecificMessage) {
    return fieldSpecificMessage;
  }

  // Fall back to the error message from Zod
  return fieldError.message;
}

