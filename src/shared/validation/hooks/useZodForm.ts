import { useMemo, useCallback, useState, useEffect } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { formatZodError } from '../utils/zodErrorFormatter';
import { ValidationError, ValidationMode, ValidationOptions } from '../types';

/**
 * Options for useZodForm hook
 */
export interface UseZodFormOptions extends ValidationOptions {
  /** Initial form data */
  initialData?: Record<string, any>;
  /** Whether to validate on mount */
  validateOnMount?: boolean;
}

/**
 * Return type for useZodForm hook
 */
export interface UseZodFormReturn {
  /** Current form data */
  formData: Record<string, any>;
  /** Update form data */
  setFormData: (data: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  /** Update a single field */
  setField: (fieldName: string, value: any) => void;
  /** Get a field value */
  getField: (fieldName: string) => any;
  /** Validation errors */
  errors: Record<string, string>;
  /** All field errors */
  fieldErrors: Array<{ path: string; message: string; code?: string }>;
  /** Whether form is valid */
  isValid: boolean;
  /** Validate the entire form */
  validate: () => ValidationError | null;
  /** Validate a specific field */
  validateField: (fieldName: string) => string | undefined;
  /** Clear all errors */
  clearErrors: () => void;
  /** Clear error for a specific field */
  clearFieldError: (fieldName: string) => void;
  /** Check if a field has been touched */
  isTouched: (fieldName: string) => boolean;
  /** Reset form to initial data */
  reset: () => void;
}

/**
 * Generic form validation hook using Zod
 *
 * @param schema - Zod schema for validation
 * @param options - Hook options
 * @returns Form state and validation functions
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   name: z.string().min(3),
 *   email: z.string().email()
 * });
 *
 * const { formData, setField, validate, errors, isValid } = useZodForm(schema);
 *
 * const handleSubmit = () => {
 *   const validationError = validate();
 *   if (!validationError) {
 *     // Form is valid, submit data
 *     submitForm(formData);
 *   }
 * };
 * ```
 */
export function useZodForm(schema: ZodSchema, options: UseZodFormOptions = {}): UseZodFormReturn {
  const { initialData = {}, mode = ValidationMode.onSubmit, validateOnMount = false } = options;

  const [formData, setFormDataState] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Validate form data against schema
  const validate = useCallback((): ValidationError | null => {
    try {
      schema.parse(formData);
      setErrors({});
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = formatZodError(error);
        setErrors(validationError.fieldErrors);
        return validationError;
      }
      return null;
    }
  }, [schema, formData]);

  // Validate a specific field
  const validateField = useCallback(
    (fieldName: string): string | undefined => {
      try {
        // Create a partial schema for just this field
        // This is a simplified approach - for nested fields, we'd need more complex logic
        schema.parse(formData);
        return undefined;
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = formatZodError(error);
          return validationError.fieldErrors[fieldName];
        }
        return undefined;
      }
    },
    [schema, formData]
  );

  // Update form data
  const setFormData = useCallback(
    (data: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
      setFormDataState((prev) => {
        const newData = typeof data === 'function' ? data(prev) : data;

        // Auto-validate based on mode
        if (mode === ValidationMode.onChange || mode === ValidationMode.all) {
          // Debounce would be handled by the component using this hook
          setTimeout(() => {
            try {
              schema.parse(newData);
              setErrors({});
            } catch (error) {
              if (error instanceof ZodError) {
                const validationError = formatZodError(error);
                setErrors(validationError.fieldErrors);
              }
            }
          }, 0);
        }

        return newData;
      });
    },
    [schema, mode]
  );

  // Update a single field
  const setField = useCallback(
    (fieldName: string, value: any) => {
      setFormDataState((prev) => {
        const newData = { ...prev };

        // Handle nested fields (e.g., 'name.en')
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          newData[parent] = {
            ...newData[parent],
            [child]: value
          };
        } else {
          newData[fieldName] = value;
        }

        // Mark field as touched
        setTouchedFields((prev) => new Set(prev).add(fieldName));

        // Auto-validate based on mode
        if (mode === ValidationMode.onChange || mode === ValidationMode.all) {
          setTimeout(() => {
            try {
              schema.parse(newData);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
              });
            } catch (error) {
              if (error instanceof ZodError) {
                const validationError = formatZodError(error);
                const fieldError = validationError.fieldErrors[fieldName];
                if (fieldError) {
                  setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
                } else {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                  });
                }
              }
            }
          }, 0);
        }

        return newData;
      });
    },
    [schema, mode]
  );

  // Get a field value
  const getField = useCallback(
    (fieldName: string): any => {
      if (fieldName.includes('.')) {
        const [parent, child] = fieldName.split('.');
        return formData[parent]?.[child];
      }
      return formData[fieldName];
    },
    [formData]
  );

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Clear error for a specific field
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Check if a field has been touched
  const isTouched = useCallback(
    (fieldName: string): boolean => {
      return touchedFields.has(fieldName);
    },
    [touchedFields]
  );

  // Reset form
  const reset = useCallback(() => {
    setFormDataState(initialData);
    setErrors({});
    setTouchedFields(new Set());
  }, [initialData]);

  // Compute field errors array
  const fieldErrors = useMemo(() => {
    return Object.entries(errors).map(([path, message]) => ({
      path,
      message,
      code: undefined // Could be enhanced to include codes
    }));
  }, [errors]);

  // Compute isValid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Validate on mount if requested
  useEffect(() => {
    if (validateOnMount) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateOnMount]);

  return {
    formData,
    setFormData,
    setField,
    getField,
    errors,
    fieldErrors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    isTouched,
    reset
  };
}
