import { useMemo } from 'react';
import { ZodError } from 'zod';
import { getFieldError, hasFieldError } from '../utils/zodErrorFormatter';

/**
 * Options for useFieldError hook
 */
export interface UseFieldErrorOptions {
  /** Custom error message formatter */
  formatMessage?: (error: string) => string;
}

/**
 * Return type for useFieldError hook
 */
export interface UseFieldErrorReturn {
  /** Error message for the field, or undefined if no error */
  error: string | undefined;
  /** Whether the field has an error */
  hasError: boolean;
  /** Clear the error (if stored locally) */
  clearError: () => void;
}

/**
 * Hook to get error for a specific field from a ZodError
 * 
 * @param zodError - The ZodError instance (can be null/undefined)
 * @param fieldName - The field name to get error for (e.g., 'name.en')
 * @param options - Optional configuration
 * @returns Field error information
 * 
 * @example
 * ```tsx
 * const { error, hasError } = useFieldError(zodError, 'name.en');
 * 
 * return (
 *   <div>
 *     <input name="name.en" />
 *     {hasError && <span className="error">{error}</span>}
 *   </div>
 * );
 * ```
 */
export function useFieldError(
  zodError: ZodError | null | undefined,
  fieldName: string,
  options: UseFieldErrorOptions = {}
): UseFieldErrorReturn {
  const { formatMessage } = options;

  const error = useMemo(() => {
    if (!zodError) return undefined;
    
    const fieldError = getFieldError(zodError, fieldName);
    
    if (!fieldError) return undefined;
    
    return formatMessage ? formatMessage(fieldError) : fieldError;
  }, [zodError, fieldName, formatMessage]);

  const hasError = useMemo(() => {
    if (!zodError) return false;
    return hasFieldError(zodError, fieldName);
  }, [zodError, fieldName]);

  const clearError = () => {
    // This is a no-op since we're reading from zodError
    // In a real implementation, you might want to clear from a parent state
    // This is kept for API consistency
  };

  return {
    error,
    hasError,
    clearError
  };
}

/**
 * Hook to get multiple field errors at once
 * Useful for getting all errors for related fields (e.g., 'name.en', 'name.he')
 * 
 * @param zodError - The ZodError instance (can be null/undefined)
 * @param fieldNames - Array of field names to get errors for
 * @param options - Optional configuration
 * @returns Record of field names to error messages
 * 
 * @example
 * ```tsx
 * const fieldErrors = useFieldErrors(zodError, ['name.en', 'name.he']);
 * // Returns { 'name.en': 'Required', 'name.he': 'Required' }
 * ```
 */
export function useFieldErrors(
  zodError: ZodError | null | undefined,
  fieldNames: string[],
  options: UseFieldErrorOptions = {}
): Record<string, string | undefined> {
  const { formatMessage } = options;

  return useMemo(() => {
    if (!zodError) {
      return fieldNames.reduce((acc, name) => {
        acc[name] = undefined;
        return acc;
      }, {} as Record<string, string | undefined>);
    }

    return fieldNames.reduce((acc, fieldName) => {
      const fieldError = getFieldError(zodError, fieldName);
      acc[fieldName] = fieldError
        ? formatMessage
          ? formatMessage(fieldError)
          : fieldError
        : undefined;
      return acc;
    }, {} as Record<string, string | undefined>);
  }, [zodError, fieldNames, formatMessage]);
}

