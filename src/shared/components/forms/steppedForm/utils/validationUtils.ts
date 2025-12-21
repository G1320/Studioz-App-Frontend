import { ZodSchema } from 'zod';
import { getNestedValue } from './formDataUtils';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface StepValidationOptions {
  schema?: ZodSchema;
  validate?: (formData: Record<string, any>) => boolean | string;
  formData: Record<string, any>;
  fields: Array<{ name: string; label?: string; onChange?: any; [key: string]: any }>;
  stepId: string;
  zodValidationResult?: { isValid: boolean; errors: Record<string, string> };
  t: (...args: any[]) => string;
}

/**
 * Validate a step using the appropriate validation method
 */
export const validateStep = ({
  schema,
  validate,
  formData,
  fields,
  stepId,
  zodValidationResult,
  t
}: StepValidationOptions): ValidationResult => {
  // Priority 1: Zod schema validation
  if (schema && zodValidationResult) {
    return zodValidationResult;
  }

  // Priority 2: Custom validate function
  if (validate) {
    const result = validate(formData);
    if (result !== true) {
      return {
        isValid: false,
        errors: {
          [stepId]: typeof result === 'string' ? result : t('form.validation.required', 'Please complete all required fields')
        }
      };
    }
  }

  // Priority 3: Basic required field validation
  const errors: Record<string, string> = {};
  fields.forEach((field) => {
    if (field.onChange) return; // Skip controlled fields

    const fieldValue = getNestedValue(formData, field.name);
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
      errors[field.name] = t('form.validation.fieldRequired', '{{field}} is required', {
        field: field.label || field.name
      });
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

