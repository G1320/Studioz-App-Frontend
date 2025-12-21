import { useMemo, useCallback } from 'react';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { useTranslation } from 'react-i18next';
import { formatZodError } from '../utils/zodErrorFormatter';
import { formatZodIssueWithI18n } from '../utils/zodI18n';
import { StepValidationResult } from '../types';

/**
 * Options for useStepValidation hook
 */
export interface UseStepValidationOptions {
  /** Whether to validate only fields in the current step */
  validateOnlyStepFields?: boolean;
  /** Field names for the current step */
  stepFieldNames?: string[];
}

/**
 * Return type for useStepValidation hook
 */
export interface UseStepValidationReturn {
  /** Whether the step is valid */
  isValid: boolean;
  /** Field errors for this step */
  errors: Record<string, string>;
  /** Array of field errors */
  fieldErrors: Array<{ path: string; message: string; code?: string }>;
  /** Step-level error message */
  message?: string;
  /** Validate the step */
  validate: () => StepValidationResult;
}

/**
 * Hook to validate a single step in a multi-step form
 * 
 * @param schema - Zod schema for the step (can be undefined for steps without validation)
 * @param formData - Current form data
 * @param stepId - Step identifier
 * @param options - Optional configuration
 * @returns Step validation result
 * 
 * @example
 * ```tsx
 * const { isValid, errors, validate } = useStepValidation(
 *   studioStep1Schema,
 *   formData,
 *   'basic-info'
 * );
 * 
 * const handleNext = () => {
 *   const result = validate();
 *   if (result.isValid) {
 *     goToNextStep();
 *   }
 * };
 * ```
 */
export function useStepValidation(
  schema: ZodSchema | undefined,
  formData: Record<string, any>,
  stepId: string,
  options: UseStepValidationOptions = {}
): UseStepValidationReturn {
  const { validateOnlyStepFields = false, stepFieldNames = [] } = options;
  const { t } = useTranslation('forms');

  const validationResult = useMemo((): StepValidationResult => {
    // If no schema, step is considered valid
    if (!schema) {
      return {
        isValid: true,
        errors: {},
        fieldErrors: []
      };
    }

    try {
      // Extract only step-specific data if validateOnlyStepFields is true
      let dataToValidate = formData;
      
      if (validateOnlyStepFields && stepFieldNames.length > 0) {
        dataToValidate = {};
        for (const fieldName of stepFieldNames) {
          // Handle nested fields (e.g., 'name.en')
          if (fieldName.includes('.')) {
            const [parent, child] = fieldName.split('.');
            if (!dataToValidate[parent]) {
              dataToValidate[parent] = {};
            }
            if (formData[parent]?.[child] !== undefined) {
              dataToValidate[parent][child] = formData[parent][child];
            }
          } else {
            if (formData[fieldName] !== undefined) {
              dataToValidate[fieldName] = formData[fieldName];
            }
          }
        }
      }

      // Validate the data
      schema.parse(dataToValidate);
      
      return {
        isValid: true,
        errors: {},
        fieldErrors: []
      };
    } catch (error) {
      if (error instanceof ZodError) {
        // Format errors with i18n translations
        const validationError = formatZodError(error, {
          formatMessage: (issue: ZodIssue) => {
            const fieldPath = issue.path.map(String).join('.');
            return formatZodIssueWithI18n(issue, t, fieldPath);
          }
        });
        
        // Filter errors to only include step fields if validateOnlyStepFields is true
        let filteredErrors = validationError.fieldErrors;
        if (validateOnlyStepFields && stepFieldNames.length > 0) {
          filteredErrors = {};
          for (const [fieldPath, message] of Object.entries(validationError.fieldErrors)) {
            // Check if this error is for a field in the current step
            const isStepField = stepFieldNames.some(stepField => {
              // Exact match
              if (stepField === fieldPath) return true;
              // Parent field match (e.g., 'name' matches 'name.en')
              if (fieldPath.startsWith(`${stepField}.`)) return true;
              // Child field match (e.g., 'name.en' matches 'name')
              if (stepField.startsWith(`${fieldPath}.`)) return true;
              return false;
            });
            
            if (isStepField) {
              filteredErrors[fieldPath] = message;
            }
          }
        }
        
        return {
          isValid: false,
          errors: filteredErrors,
          fieldErrors: validationError.errors.filter(err => 
            Object.keys(filteredErrors).includes(err.path)
          ),
          message: validationError.message
        };
      }
      
      return {
        isValid: false,
        errors: {},
        fieldErrors: [],
        message: 'Validation failed'
      };
    }
  }, [schema, formData, stepId, validateOnlyStepFields, stepFieldNames]);

  const validate = useCallback((): StepValidationResult => {
    return validationResult;
  }, [validationResult]);

  return {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    fieldErrors: validationResult.fieldErrors,
    message: validationResult.message,
    validate
  };
}

