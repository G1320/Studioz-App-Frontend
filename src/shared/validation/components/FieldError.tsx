import React from 'react';
import { useTranslation } from 'react-i18next';
import './FieldError.scss';

/**
 * Props for FieldError component
 */
export interface FieldErrorProps {
  /** Error message to display */
  error?: string;
  /** Field name for accessibility */
  fieldName?: string;
  /** Additional CSS class */
  className?: string;
  /** Whether to show the error icon */
  showIcon?: boolean;
  /** Custom error message formatter */
  formatMessage?: (message: string) => string;
}

/**
 * FieldError component for displaying field-level validation errors
 *
 * @example
 * ```tsx
 * <FieldError
 *   error={errors['name.en']}
 *   fieldName="name.en"
 * />
 * ```
 */
export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  fieldName,
  className = '',
  showIcon = false,
  formatMessage
}) => {
  const { t: _t } = useTranslation('forms');

  if (!error) {
    return null;
  }

  const displayMessage = formatMessage ? formatMessage(error) : error;

  return (
    <div
      className={`field-error ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      id={fieldName ? `error-${fieldName}` : undefined}
    >
      {showIcon && (
        <span className="field-error__icon" aria-hidden="true">
          ⚠️
        </span>
      )}
      <span className="field-error__message">{displayMessage}</span>
    </div>
  );
};

export default FieldError;
