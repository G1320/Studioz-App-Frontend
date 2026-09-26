import { ZodIssue } from 'zod';
import { useTranslation } from 'react-i18next';
import { FieldError } from '../types';

/**
 * Default i18n key mapping for Zod error codes
 * Maps Zod error codes to translation keys in forms.json (under form.validation)
 */
export const ZOD_ERROR_I18N_MAP: Record<string, string> = {
  invalid_type: 'form.validation.errors.invalidType',
  invalid_literal: 'form.validation.errors.invalidLiteral',
  unrecognized_keys: 'form.validation.errors.unrecognizedKeys',
  invalid_union: 'form.validation.errors.invalidUnion',
  invalid_union_discriminator: 'form.validation.errors.invalidUnionDiscriminator',
  invalid_enum_value: 'form.validation.errors.invalidEnumValue',
  invalid_arguments: 'form.validation.errors.invalidArguments',
  invalid_return_type: 'form.validation.errors.invalidReturnType',
  invalid_date: 'form.validation.errors.invalidDate',
  custom: 'form.validation.errors.custom',
  invalid_string: 'form.validation.errors.invalidString',
  too_small: 'form.validation.errors.tooSmall',
  too_big: 'form.validation.errors.tooBig',
  invalid_intersection_types: 'form.validation.errors.invalidIntersectionTypes',
  not_multiple_of: 'form.validation.errors.notMultipleOf',
  not_finite: 'form.validation.errors.notFinite'
};

/**
 * Gets the i18n translation key for a Zod error code
 *
 * @param code - The Zod error code
 * @returns The i18n translation key
 */
export function getI18nKeyForZodCode(code: string): string {
  return ZOD_ERROR_I18N_MAP[code] || 'form.validation.errors.generic';
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
  // Try field-specific error message first (e.g., form.validation.fields.name.he.invalidType)
  if (fieldName) {
    const fieldSpecificKey = `form.validation.fields.${fieldName}.${issue.code}`;
    const fieldSpecificMessage = t(fieldSpecificKey, { defaultValue: '' });
    if (fieldSpecificMessage && fieldSpecificMessage !== fieldSpecificKey) {
      return interpolateMessage(fieldSpecificMessage, issue);
    }
  }

  // Try generic field error (e.g., form.validation.fields.name.he.error)
  if (fieldName) {
    const genericFieldKey = `form.validation.fields.${fieldName}.error`;
    const genericFieldMessage = t(genericFieldKey, { defaultValue: '' });
    if (genericFieldMessage && genericFieldMessage !== genericFieldKey) {
      return interpolateMessage(genericFieldMessage, issue);
    }
  }

  // Handle invalid_enum_value errors for days field with a nicer message
  if ((issue.code as string) === 'invalid_enum_value' && fieldName) {
    if (fieldName === 'studioAvailability.days' || fieldName === 'days' || fieldName.includes('days')) {
      return t('form.validation.fields.studioAvailability.days.error', {
        defaultValue: 'Please select at least one day when your studio is open'
      });
    }
  }

  // For invalid_type errors on translation fields, provide a nicer default message
  if (issue.code === 'invalid_type' && fieldName) {
    // Check if it's a translation field (e.g., name.en, name.he)
    const parts = fieldName.split('.');
    if (parts.length === 2) {
      const [field, lang] = parts;
      if (lang === 'en' || lang === 'he') {
        const langKey = `form.validation.fields.${field}.${lang}.error`;
        const langMessage = t(langKey, { defaultValue: '' });
        if (langMessage && langMessage !== langKey) {
          return langMessage;
        }
        const langName = lang === 'en' ? 'English' : 'Hebrew';
        return `Please enter the ${field} in ${langName}`;
      }
    }

    // Handle common required fields with nicer messages (already tried field keys above)
    if (fieldName === 'address') {
      return t('form.validation.fields.address.error', { defaultValue: 'Address is required' });
    }
    if (fieldName === 'phone') {
      return t('form.validation.fields.phone.error', { defaultValue: 'Phone number is required' });
    }
    if (fieldName === 'coverImage' || fieldName === 'galleryImages') {
      return t('form.validation.fields.galleryImages.too_small', {
        defaultValue: t('form.validation.fields.coverImage.error', {
          defaultValue: 'At least one image is required'
        })
      });
    }
    if (fieldName === 'maxOccupancy') {
      const invalidTypeIssue = issue as { received?: string };
      if (invalidTypeIssue.received === 'string') {
        return t('form.validation.fields.maxOccupancy.too_small', {
          defaultValue: 'Max occupancy must be a number'
        });
      }
      return t('form.validation.fields.maxOccupancy.error', {
        defaultValue: 'Max occupancy is required'
      });
    }
    if (fieldName === 'isSmokingAllowed' || fieldName === 'isWheelchairAccessible') {
      return t(`form.validation.fields.${fieldName}.error`, {
        defaultValue: 'This field is required'
      });
    }
  }

  // Image array too_small should never fall through to English Zod defaults
  if (issue.code === 'too_small' && (fieldName === 'galleryImages' || fieldName === 'coverImage')) {
    return t('form.validation.fields.galleryImages.too_small', {
      defaultValue: 'At least one image is required'
    });
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
export function formatFieldErrorWithI18n(fieldError: FieldError, t: (key: string, options?: any) => string): string {
  // Try to get field-specific error
  const fieldSpecificKey = `form.validation.fields.${fieldError.path}.error`;
  const fieldSpecificMessage = t(fieldSpecificKey, { defaultValue: '' });

  if (fieldSpecificMessage) {
    return fieldSpecificMessage;
  }

  // Fall back to the error message from Zod
  return fieldError.message;
}
