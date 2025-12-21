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

  // Filter out technical error messages and format field names nicely
  const formatFieldName = (fieldName: string): string => {
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      const lastPart = parts[parts.length - 1];
      
      // Map common field suffixes to readable names
      if (lastPart === 'en') return 'English';
      if (lastPart === 'he') return 'Hebrew';
      
      // If parent is a known field, format nicely
      const parent = parts[parts.length - 2];
      if (parent === 'name' && lastPart === 'en') return 'English Name';
      if (parent === 'name' && lastPart === 'he') return 'Hebrew Name';
      if (parent === 'subtitle' && lastPart === 'en') return 'English Subtitle';
      if (parent === 'subtitle' && lastPart === 'he') return 'Hebrew Subtitle';
      if (parent === 'description' && lastPart === 'en') return 'English Description';
      if (parent === 'description' && lastPart === 'he') return 'Hebrew Description';
      
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  };

  // Clean error messages - remove any JSON-like structures or technical details
  const cleanErrorMessage = (errorMsg: string): string => {
    if (!errorMsg) return '';
    
    const msg = String(errorMsg).trim();
    
    // Remove JSON-like structures (entire JSON objects)
    if (msg.startsWith('[') || msg.startsWith('{')) {
      // Try to extract user-friendly message from JSON
      try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed) && parsed[0]?.message) {
          return parsed[0].message;
        }
        if (parsed.message) {
          return parsed.message;
        }
      } catch {
        // Not valid JSON, continue with cleaning
      }
    }
    
    // Remove lines with technical details
    const lines = msg.split('\n').filter(line => {
      const lowerLine = line.toLowerCase();
      return !lowerLine.includes('"expected"') &&
             !lowerLine.includes('"code"') &&
             !lowerLine.includes('"path"') &&
             !lowerLine.includes('"received"') &&
             !lowerLine.includes('invalid_type') &&
             !lowerLine.trim().startsWith('{') &&
             !lowerLine.trim().startsWith('[');
    });
    
    const cleaned = lines.join(' ').trim();
    
    // If we have a cleaned message, use it; otherwise try to extract from original
    if (cleaned) {
      return cleaned;
    }
    
    // Last resort: extract meaningful part
    if (msg.includes(':')) {
      const parts = msg.split(':');
      const lastPart = parts[parts.length - 1].trim();
      if (lastPart && !lastPart.includes('{') && !lastPart.includes('[')) {
        return lastPart;
      }
    }
    
    return msg;
  };

  const errorEntries = Object.entries(errors)
    .filter(([_, errorMsg]) => {
      // Filter out technical JSON-like error messages
      const msg = String(errorMsg);
      return !msg.includes('"expected"') && !msg.includes('"code"') && !msg.includes('"path"');
    })
    .slice(0, maxFieldErrors);
  
  const remainingErrors = Object.keys(errors).length - errorEntries.length;

  return (
    <div
      className={`step-error ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {showFieldErrors && errorEntries.length > 0 && (
        <div className="step-error__content">
          <div className="step-error__header">
            <span className="step-error__icon" aria-hidden="true">
              ⚠️
            </span>
            <span className="step-error__title">
              {t('form.validation.required', 'Please complete the following fields')}
            </span>
          </div>
          <ul className="step-error__field-list">
            {errorEntries.map(([fieldName, errorMessage]) => {
              const cleanMessage = cleanErrorMessage(String(errorMessage));
              const displayFieldName = formatFieldName(fieldName);
              
              return (
                <li key={fieldName} className="step-error__field-item">
                  <span className="step-error__field-message">{cleanMessage}</span>
                </li>
              );
            })}
            {remainingErrors > 0 && (
              <li className="step-error__field-item step-error__field-item--more">
                {t('form.validation.required')} ({remainingErrors} {remainingErrors === 1 ? 'more error' : 'more errors'})
              </li>
            )}
          </ul>
        </div>
      )}

      {!showFieldErrors && message && (
        <div className="step-error__message">
          <span className="step-error__icon" aria-hidden="true">
            ⚠️
          </span>
          <span>{cleanErrorMessage(message)}</span>
        </div>
      )}
    </div>
  );
};

// Helper function to get field label from field name
function getFieldLabel(fieldName: string, t: (key: string) => string): string {
  if (fieldName.includes('.')) {
    const parts = fieldName.split('.');
    const lastPart = parts[parts.length - 1];
    const parent = parts[parts.length - 2];
    
    // Try to get translation first
    const translationKey = `form.${parent}.${lastPart}`;
    const translated = t(translationKey);
    if (translated && translated !== translationKey) {
      return translated;
    }
    
    // Fallback to formatted name
    if (lastPart === 'en') return 'English';
    if (lastPart === 'he') return 'Hebrew';
    if (parent === 'name') {
      return lastPart === 'en' ? 'English Name' : 'Hebrew Name';
    }
    if (parent === 'subtitle') {
      return lastPart === 'en' ? 'English Subtitle' : 'Hebrew Subtitle';
    }
    if (parent === 'description') {
      return lastPart === 'en' ? 'English Description' : 'Hebrew Description';
    }
    
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  }
  
  // Try translation for simple field names
  const translationKey = `form.${fieldName}.label`;
  const translated = t(translationKey);
  if (translated && translated !== translationKey) {
    return translated;
  }
  
  return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

export default StepError;

