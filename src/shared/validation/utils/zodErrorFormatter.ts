import { ZodError, ZodIssue } from 'zod';
import { FieldError, ValidationError } from '../types';
import { mapPathToField } from './fieldPathMapper';

/**
 * Formats a Zod error into a ValidationError object
 * 
 * @param error - The ZodError instance
 * @param options - Optional formatting options
 * @returns ValidationError with field errors mapped
 * 
 * @example
 * ```ts
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     const validationError = formatZodError(error);
 *     console.log(validationError.fieldErrors);
 *   }
 * }
 * ```
 */
export function formatZodError(
  error: ZodError,
  options?: {
    /** Custom message formatter */
    formatMessage?: (issue: ZodIssue) => string;
  }
): ValidationError {
  const fieldErrors: Record<string, string> = {};
  const errors: FieldError[] = [];

  for (const issue of error.issues) {
    const fieldPath = mapPathToField(issue.path as (string | number)[]);
    const message = options?.formatMessage
      ? options.formatMessage(issue)
      : issue.message;

    // If multiple errors for same field, combine them
    if (fieldErrors[fieldPath]) {
      fieldErrors[fieldPath] = `${fieldErrors[fieldPath]}, ${message}`;
    } else {
      fieldErrors[fieldPath] = message;
    }

    errors.push({
      path: fieldPath,
      message,
      code: issue.code
    });
  }

  return {
    fieldErrors,
    errors,
    message: error.message || 'Validation failed'
  };
}

/**
 * Formats a single Zod issue into a FieldError
 * 
 * @param issue - The ZodIssue instance
 * @returns FieldError object
 */
export function formatZodIssue(issue: ZodIssue): FieldError {
  return {
    path: mapPathToField(issue.path as (string | number)[]),
    message: issue.message,
    code: issue.code
  };
}

/**
 * Gets the error message for a specific field from a ZodError
 * 
 * @param error - The ZodError instance
 * @param fieldName - The field name to get error for (e.g., 'name.en')
 * @returns Error message or undefined if no error for that field
 * 
 * @example
 * ```ts
 * const errorMessage = getFieldError(zodError, 'name.en');
 * if (errorMessage) {
 *   console.log(`Name error: ${errorMessage}`);
 * }
 * ```
 */
export function getFieldError(
  error: ZodError,
  fieldName: string
): string | undefined {
  const validationError = formatZodError(error);
  return validationError.fieldErrors[fieldName];
}

/**
 * Checks if a ZodError has an error for a specific field
 * 
 * @param error - The ZodError instance
 * @param fieldName - The field name to check
 * @returns Whether the field has an error
 */
export function hasFieldError(error: ZodError, fieldName: string): boolean {
  return getFieldError(error, fieldName) !== undefined;
}

/**
 * Gets all field errors for fields matching a pattern
 * Useful for getting all errors for a parent field (e.g., 'name.*')
 * 
 * @param error - The ZodError instance
 * @param pattern - The field pattern to match (supports wildcards)
 * @returns Record of matching field errors
 * 
 * @example
 * ```ts
 * const nameErrors = getFieldErrorsByPattern(zodError, 'name.*');
 * // Returns { 'name.en': 'Required', 'name.he': 'Required' }
 * ```
 */
export function getFieldErrorsByPattern(
  error: ZodError,
  pattern: string
): Record<string, string> {
  const validationError = formatZodError(error);
  const matchingErrors: Record<string, string> = {};

  for (const [fieldName, message] of Object.entries(validationError.fieldErrors)) {
    if (fieldName === pattern || fieldName.startsWith(`${pattern}.`)) {
      matchingErrors[fieldName] = message;
    }
  }

  return matchingErrors;
}

