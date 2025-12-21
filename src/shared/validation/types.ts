/**
 * Base types for form validation system
 */

/**
 * Validation mode for when validation should occur
 */
export enum ValidationMode {
  /** Validate only when form is submitted */
  onSubmit = 'onSubmit',
  /** Validate when field loses focus */
  onBlur = 'onBlur',
  /** Validate as user types (debounced) */
  onChange = 'onChange',
  /** Validate on all events (blur, change, submit) */
  all = 'all'
}

/**
 * Field-level validation error
 */
export interface FieldError {
  /** Field path (e.g., 'name.en', 'address.street') */
  path: string;
  /** Error message to display */
  message: string;
  /** Zod error code (e.g., 'too_small', 'invalid_type') */
  code?: string;
}

/**
 * Validation error containing field errors
 */
export interface ValidationError {
  /** Map of field paths to error messages */
  fieldErrors: Record<string, string>;
  /** Array of all field errors */
  errors: FieldError[];
  /** General form-level error message */
  message?: string;
}

/**
 * Result of step validation
 */
export interface StepValidationResult {
  /** Whether the step is valid */
  isValid: boolean;
  /** Field errors for this step */
  errors: Record<string, string>;
  /** Array of field errors */
  fieldErrors: FieldError[];
  /** Step-level error message */
  message?: string;
}

/**
 * Form validation result
 */
export interface FormValidationResult {
  /** Whether the entire form is valid */
  isValid: boolean;
  /** Step validation results (for multi-step forms) */
  stepResults?: Record<string, StepValidationResult>;
  /** All field errors across all steps */
  errors: Record<string, string>;
  /** Array of all field errors */
  fieldErrors: FieldError[];
  /** Form-level error message */
  message?: string;
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  /** Validation mode */
  mode?: ValidationMode;
  /** Whether to validate nested fields */
  validateNested?: boolean;
  /** Custom error message formatter */
  formatError?: (error: FieldError) => string;
  /** Abort signal for async validation */
  signal?: AbortSignal;
}

