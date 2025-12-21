import React from 'react';
import { useTranslation } from 'react-i18next';
import './StepError.scss';

/**
 * Props for StepError component
 */
export interface StepErrorProps {
  /** Step-level error message */
  message?: string;
  /** Field errors for this step */
  errors?: Record<string, string>;
  /** Step title */
  stepTitle?: string;
  /** Additional CSS class */
  className?: string;
  /** Whether to show field-level errors */
  showFieldErrors?: boolean;
  /** Maximum number of field errors to display */
  maxFieldErrors?: number;
}

/**
 * StepError component for displaying step-level validation errors
 * 
 * @example
 * ```tsx
 * <StepError 
 *   message="Please fix the errors below"
 *   errors={stepErrors}
 *   stepTitle="Basic Information"
 * />
 * ```
 */
export const StepError: React.FC<StepErrorProps> = ({
  message,
  errors = {},
  stepTitle,
  className = '',
  showFieldErrors = true,
  maxFieldErrors = 5
}) => {
  const { t } = useTranslation('forms');

  const hasErrors = message || Object.keys(errors).length > 0;

  if (!hasErrors) {
    return null;
  }

  const errorEntries = Object.entries(errors).slice(0, maxFieldErrors);
  const remainingErrors = Object.keys(errors).length - maxFieldErrors;

  return (
    <div
      className={`step-error ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {message && (
        <div className="step-error__message">
          <span className="step-error__icon" aria-hidden="true">
            ⚠️
          </span>
          <span>{message}</span>
        </div>
      )}

      {showFieldErrors && errorEntries.length > 0 && (
        <ul className="step-error__field-list">
          {errorEntries.map(([fieldName, errorMessage]) => (
            <li key={fieldName} className="step-error__field-item">
              <span className="step-error__field-name">
                {fieldName.includes('.') ? fieldName.split('.').pop() : fieldName}:
              </span>
              <span className="step-error__field-message">{errorMessage}</span>
            </li>
          ))}
          {remainingErrors > 0 && (
            <li className="step-error__field-item step-error__field-item--more">
              {t('form.validation.required')} ({remainingErrors} {remainingErrors === 1 ? 'more' : 'more'})
            </li>
          )}
        </ul>
      )}

      {stepTitle && (
        <div className="step-error__step-title">
          {stepTitle}
        </div>
      )}
    </div>
  );
};

export default StepError;

